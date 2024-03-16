import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsFlavors", (t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    flavorId: t.integer().foreignKey("flavors", "id"),
    link: t.varchar().nullable(),
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id"),
    ...t.timestampsNoTZ(),
  }));
});
