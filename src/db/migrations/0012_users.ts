import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("users", (t) => ({
    id: t.identity().primaryKey(),
    login: t.varchar(),
    password: t.varchar(),
    status: t.integer().default(1),
    ...t.timestampsNoTZ(),
  }));
});
