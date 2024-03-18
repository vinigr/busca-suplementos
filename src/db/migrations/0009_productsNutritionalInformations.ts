import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsNutritionalInformations", (t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    nutritionalInformationId: t
      .integer()
      .foreignKey("nutritionalInformations", "id"),
    order: t.integer(),
    quantity: t.real(),
    unitsMeasurement: t.integer().nullable(),
    percentageDaily: t.real().nullable(),
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id")
      .nullable(),
    isSubItem: t.boolean().default(false),
    ...t.timestampsNoTZ(),
  }));
});
