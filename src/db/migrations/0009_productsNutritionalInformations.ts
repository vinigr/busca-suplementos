import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsNutritionalInformations", (t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    nutritionalInformationId: t
      .integer()
      .foreignKey("nutritionalInformations", "id"),
    order: t.integer(),
    quantity: t.integer(),
    unitsMeasurement: t.integer(),
    percentageDaily: t.integer(),
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id"),
    isSubItem: t.boolean().default(false),
    ...t.timestampsNoTZ(),
  }));
});
