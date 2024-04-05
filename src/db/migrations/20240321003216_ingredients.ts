import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("ingredients", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    description: t.varchar().nullable(),
    isSweetener: t.boolean().default(false),
    isSugar: t.boolean().default(false),
    slug: t.varchar().unique(),
    ...t.timestampsNoTZ(),
  }));
});
