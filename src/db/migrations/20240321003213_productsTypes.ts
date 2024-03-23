import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("productsTypes", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    slug: t.varchar(),
    ...t.timestampsNoTZ(),
  }));
});
