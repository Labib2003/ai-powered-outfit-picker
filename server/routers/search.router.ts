import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema/category";
import { Product, productsTable } from "@/db/schema/product";

const CategoryPlanSchema = z.object({
  greeting: z.string(),
  categories: z.array(
    z.object({
      name: z.string(),
      count: z.number().int().min(1).max(5),
      reason: z.string(),
    }),
  ),
});
const ProductValidationSchema = z.object({
  suitable: z.boolean(),
  reason: z.string(),
});
const categoryPlanParser =
  StructuredOutputParser.fromZodSchema(CategoryPlanSchema);

const productValidationParser = StructuredOutputParser.fromZodSchema(
  ProductValidationSchema,
);
type CategoryPlan = z.infer<typeof CategoryPlanSchema>;
type ProductValidation = z.infer<typeof ProductValidationSchema>;

const openai = new OpenAI();
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const categoryPlanPrompt = new PromptTemplate({
  template: `
    You are a shopping assistant.

    These are the ONLY product categories that exist.
    You must choose strictly from this list.

    Available categories:
    {categories}

    Rules:
    - Do not invent categories
    - If nothing matches, return an empty categories array
    - Decide if one or multiple categories are needed
    - Decide how many products to suggest per category

    {format_instructions}

    User request:
    {input}
  `,
  inputVariables: ["input", "categories"],
  partialVariables: {
    format_instructions: categoryPlanParser.getFormatInstructions(),
  },
});
const productValidationPrompt = new PromptTemplate({
  template: `
    You are a knowledgeable in-store sales associate.

    Customer request:
    "{userPrompt}"

    Product:
    Name: "{name}"
    Description: "{description}"

    Rules:
    - suitable = true ONLY if it genuinely fits
    - Reject items that feel off in tone, formality, or purpose
    - Be practical and honest, not promotional

    Style:
    - Explain it like a face-to-face recommendation
    - Reference design, style, or use
    - Max 50 words

    {format_instructions}
  `,
  inputVariables: ["userPrompt", "name", "description"],
  partialVariables: {
    format_instructions: productValidationParser.getFormatInstructions(),
  },
});

export const searchRouter = router({
  semanticProductSearch: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(3, "Prompt is too short"),
      }),
    )
    .mutation(async ({ input }) => {
      const categories = await db.select().from(categoryTable);

      if (categories.length === 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No product categories are configured in the system.",
        });
      }

      const categoryContext = categories
        .map((c) => `- ${c.name}: ${c.description}`)
        .join("\n");

      let plan: CategoryPlan;

      try {
        plan = await llm.pipe(categoryPlanParser).invoke(
          await categoryPlanPrompt.format({
            input: input.prompt,
            categories: categoryContext,
          }),
        );
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to understand the request.",
          cause: err,
        });
      }

      const categoryMap = new Map(categories.map((c) => [c.name, c]));

      const resolvedCategories = plan.categories
        .map((item) => {
          const category = categoryMap.get(item.name);
          if (!category) return null;

          return {
            categoryId: category.id,
            categoryName: category.name,
            count: item.count,
            reason: item.reason,
          };
        })
        .filter(Boolean) as {
          categoryId: string;
          categoryName: string;
          count: number;
          reason: string;
        }[];

      if (resolvedCategories.length === 0) {
        return {
          message:
            "I couldn’t find anything that matches what you’re looking for.",
          results: [],
        };
      }

      let queryEmbedding: number[];

      try {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: input.prompt,
        });

        queryEmbedding = embeddingResponse.data[0].embedding;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process your request.",
          cause: err,
        });
      }

      const results: {
        product: Product & { reason: string };
        category: { id: string; name: string; reason: string };
        similarity: number;
      }[] = [];

      for (const category of resolvedCategories) {
        const similarity = sql<number>`
          1 - (${cosineDistance(productsTable.embedding, queryEmbedding)})
        `;

        const rows = await db
          .select({
            product: productsTable,
            similarity,
          })
          .from(productsTable)
          .where(
            and(
              eq(productsTable.categoryId, category.categoryId),
              gt(similarity, 0.2),
            ),
          )
          .orderBy((t) => desc(t.similarity))
          .limit(category.count);

        for (const row of rows) {
          const validation: ProductValidation = await llm
            .pipe(productValidationParser)
            .invoke(
              await productValidationPrompt.format({
                userPrompt: input.prompt,
                name: row.product.name,
                description: row.product.description,
              }),
            );

          if (!validation.suitable) continue;

          results.push({
            product: {
              ...row.product,
              reason: validation.reason,
            },
            category: {
              id: category.categoryId,
              name: category.categoryName,
              reason: category.reason,
            },
            similarity: row.similarity,
          });
        }
      }

      const groupedResults = Object.values(
        results.reduce<
          Record<
            string,
            {
              category: {
                id: string;
                name: string;
                reason: string;
              };
              products: Product[];
            }
          >
        >((acc, curr) => {
          const categoryId = curr.category.id;

          if (!acc[categoryId]) {
            acc[categoryId] = {
              category: {
                id: curr.category.id,
                name: curr.category.name,
                reason: curr.category.reason,
              },
              products: [],
            };
          }

          acc[categoryId].products.push(curr.product);

          return acc;
        }, {}),
      );

      return {
        message: plan.greeting,
        results: groupedResults,
      };
    }),
});
