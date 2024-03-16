import { change } from "../dbScript";

change(async (db) => {
  await db.changeTable("productsNutritionalInformations", (t) => ({
    productNutritionalInformationGroupId: t
      .integer()
      .foreignKey("productsNutritionalInformationsGroups", "id"),
  }));
});
