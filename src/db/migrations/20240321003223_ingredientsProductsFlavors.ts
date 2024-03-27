import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("ingredientsProductsFlavors", (t) => ({
    id: t.identity().primaryKey(),
    ingredientId: t.integer().foreignKey("ingredients", "id"),
    productFlavorId: t.integer().foreignKey("productsFlavors", "id"),
    order: t.integer(),
    capsule: t.boolean().default(false),
    ...t.timestampsNoTZ(),
  }));
});
