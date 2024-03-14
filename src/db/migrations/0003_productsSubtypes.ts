import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsSubtypes", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productTypeId: t.integer().foreignKey("productsTypes", "id"),
    ...t.timestampsNoTZ(),
  }));
});
