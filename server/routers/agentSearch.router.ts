/*
 This was my blind attempt to use an agent-based approach. Without checking any tutorials. 
 But it significantly degraded efficiency and increased cost.

 The agent-based approach sometimes invoked the same tools multiple times and ballooned token usage to over 66k per request. 
 In best case I managed to reduce it down to around 2.8k tokens, still much higher than the deterministic flow. It also increased latency significantly.

 Moreover, structured responses were incompatible with LangChain tools, causing parsing errors. 
 In short, for deterministic, schema-bound workflows, agents are overkill. 
 They introduce redundant calls, explode context size, and drive up costs without improving reasoning, whereas a split pipeline of minimal-model reasoning plus deterministic retrieval remains far more efficient and reliable.
*/

import { db } from "@/db/drizzle";
import { categorySelectSchema, categoryTable } from "@/db/schema/category";
import { productSelectSchema, productsTable } from "@/db/schema/product";
import { ChatOpenAI } from "@langchain/openai";
import { and, cosineDistance, desc, gt, inArray, sql } from "drizzle-orm";
import { createAgent, tool } from "langchain";
import OpenAI from "openai";
import z from "zod";

const openai = new OpenAI();
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const getAvailableCategories = tool(
  async () => {
    console.log("Fetching available categories");
    const categories = await db
      .select({
        id: categoryTable.id,
        name: categoryTable.name,
        description: categoryTable.description,
      })
      .from(categoryTable);

    return { categories };
  },
  {
    name: "get_available_categories",
    description: "Get the list of available product categories.",
    schema: z.object({}).describe("No input required"),
  },
);

const getProductsByCategoryAndSimilarity = tool(
  async ({ categoryIds, prompt }) => {
    console.log("Generating embedding for prompt" + prompt);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt,
    });
    const embedding = response.data[0].embedding;

    console.log("Getting products by category and similarity");
    const similarity = sql<number>`
          1 - (${cosineDistance(productsTable.embedding, embedding)})
        `;

    const rows = await db
      .select({
        product: {
          id: productsTable.id,
          name: productsTable.name,
          description: productsTable.description,
          imageUrl: productsTable.imageUrl,
          price: productsTable.price,
          categoryId: productsTable.categoryId,
        },
        similarity,
      })
      .from(productsTable)
      .where(
        and(
          inArray(productsTable.categoryId, categoryIds),
          gt(similarity, 0.2),
        ),
      )
      .orderBy((t) => desc(t.similarity))
      .limit(5);

    return { products: rows.map((r) => r.product) };
  },
  {
    name: "get_products_by_category_and_similarity",
    description:
      "Get products by category ID and similarity to a given embedding.",
    schema: z.object({
      categoryIds: z
        .array(z.string())
        .describe("The IDs of the product categories."),
      prompt: z.string().describe("The user prompt to compute similarity."),
    }),
  },
);

const searchAgent = createAgent({
  model,
  systemPrompt: `
    You are a deterministic shopping assistant.

    You MUST follow this exact protocol:

    STEP 1 — CATEGORY SELECTION
    - Call getAvailableCategories exactly ONCE.
    - Select the most relevant category IDs based on the user's request.
    - Do NOT call any other tool in this step.

    STEP 2 — PRODUCT SEARCH
    - Call getProductsByCategoryAndSimilarity exactly ONCE.
    - Use ONLY the category IDs selected in STEP 1.
    - Do NOT call getAvailableCategories again.

    STEP 3 — FINAL RESPONSE
    - After product search, DO NOT call any tools.
    - Generate the final answer for the user.
    - STOP.

    RULES:
    - NEVER call the same tool more than once.
    - NEVER retry a tool call.
    - NEVER call tools after STEP 2.
    - If sufficient data is available, proceed to STEP 3 immediately.

    Violating any rule is incorrect behavior.
  `,
  tools: [getAvailableCategories, getProductsByCategoryAndSimilarity],
  responseFormat: z.object({
    message: z.string().describe("A friendly welcome message to the user."),
    results: z
      .object({
        category: categorySelectSchema
          .extend({
            reason: z.string().describe("Reason to choose this category"),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .describe("The product category details."),
        products: productSelectSchema
          .extend({
            reason: z
              .string()
              .describe("Reason to choose this specific product"),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .array()
          .describe("The list of recommended products in this category."),
      })
      .array(),
  }),
});

searchAgent
  .invoke({
    messages: [{ role: "user", content: "I need a professional outfit work." }],
  })
  .then(console.log);
