import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("flavors", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    ...t.timestampsNoTZ(),
  }));
});
