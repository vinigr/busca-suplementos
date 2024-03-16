import { change } from "../dbScript";

change(async (db) => {
  await db.createTable("products", (t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productTypeId: t.integer().foreignKey("productsTypes", "id"),
    productSubtypeId: t
      .integer()
      .foreignKey("productsSubtypes", "id")
      .nullable(),
    companyId: t.integer().foreignKey("companies", "id"),
    portion: t.integer().nullable(),
    weigth: t.integer().nullable(),
    capsules: t.integer().nullable(),
    form: t.integer(),
    stampId: t.integer().foreignKey("stamps", "id").nullable(),
    link: t.varchar().nullable(),
    urlImage: t.varchar().nullable(),
    ...t.timestampsNoTZ(),
  }));
});
