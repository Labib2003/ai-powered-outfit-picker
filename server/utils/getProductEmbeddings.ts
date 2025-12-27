import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema/category";
import { productsTable } from "@/db/schema/product";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI();

const BATCH_SIZE = 10;

function buildEmbeddingText(product: any) {
  return [
    `Product name: ${product.products.name}`,
    product.products.description
      ? `Description: ${product.products.description}`
      : null,
    product.categories?.name ? `Category: ${product.categories.name}` : null,
    product.categories?.description
      ? `Category description: ${product.categories.description}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const products = await db
    .select()
    .from(productsTable)
    .leftJoin(categoryTable, eq(productsTable.categoryId, categoryTable.id));

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    const inputs = batch.map(buildEmbeddingText);

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: inputs,
    });

    await Promise.all(
      embeddingResponse.data.map((item, index) => {
        const product = batch[index];

        return db
          .update(productsTable)
          .set({ embedding: item.embedding })
          .where(eq(productsTable.id, product.products.id));
      }),
    );

    console.log(
      `Embedded ${Math.min(i + BATCH_SIZE, products.length)} / ${products.length}`,
    );
  }
}

main()
  .then(() => {
    console.log("✅ Embedding generation completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Embedding generation failed", err);
    process.exit(1);
  });
