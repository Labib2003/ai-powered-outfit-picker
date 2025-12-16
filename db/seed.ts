import { faker } from "@faker-js/faker";
import { products, sizesEnum } from "./schema/product";
import { categoryTable } from "./schema/category";
import { randomUUID } from "crypto";
import { db } from "./drizzle";

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Create 5 categories
  const categoryData = Array.from({ length: 5 }).map(() => ({
    id: randomUUID(),
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
  }));

  await db.insert(categoryTable).values(categoryData);
  console.log("✅ Inserted categories");

  // 2️⃣ Create 25 products (5 per category)
  const sizeOptions = sizesEnum.enumValues;
  const productData = categoryData.flatMap((cat) =>
    Array.from({ length: 5 }).map(() => ({
      id: randomUUID(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      availableSizes: faker.helpers.arrayElements(
        sizeOptions,
        faker.number.int({ min: 2, max: 4 }),
      ),
      price: faker.commerce.price({ min: 20, max: 150, dec: 2 }),
      categoryId: cat.id,
      embedding: Array.from({ length: 1536 }, () =>
        faker.number.float({ min: -1, max: 1 }),
      ),
    })),
  );

  await db.insert(products).values(productData);
  console.log("✅ Inserted products");

  console.log("🌾 Done seeding!");
}

main().catch((err) => {
  console.error("❌ Seed error:", err);
});
