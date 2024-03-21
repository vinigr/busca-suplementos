import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsNutritionalInformationsGroups", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productId: t.integer().foreignKey("products", "id"),
    ...t.timestampsNoTZ(),
  }));
});
