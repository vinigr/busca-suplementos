import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("companies", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    active: t.boolean().default(true),
    urlImage: t.varchar().nullable(),
    ...t.timestampsNoTZ(),
  }));
});
