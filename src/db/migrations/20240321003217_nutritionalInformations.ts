import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("nutritionalInformations", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    slug: t.varchar().index(),
    ...t.timestampsNoTZ(),
  }));
});
