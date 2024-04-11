import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";
import { FlavorsTable } from "./flavors.table";
import { IngredientsProductsFlavorsTable } from "./ingredientsProductsFlavors.table";
import { ProductsNutritionalInformationsGroupsTable } from "./productsNutritionalInformationsGroups.table";

export class ProductsFlavorsTable extends BaseTable {
  readonly table = "productsFlavors";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    flavorId: t.integer().foreignKey("flavors", "id"),
    link: t.varchar().nullable(),
    urlImage: t.varchar().nullable(),
    containsGluten: t.boolean(),
    containsLactose: t.boolean(),
    containsSoyDerivatives: t.boolean(),
    containsMilkDerivatives: t.boolean(),
    proteinTotal: t.real().nullable(),
    proteinGramPrice: t.real().nullable(),
    productNutritionalInformationGroupId: t
      .integer()
      .foreignKey("productsNutritionalInformationsGroups", "id"),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    product: this.belongsTo(() => ProductsTable, {
      columns: ["productId"],
      references: ["id"],
    }),
    flavor: this.belongsTo(() => FlavorsTable, {
      columns: ["flavorId"],
      references: ["id"],
    }),
    productNutritionalInformations: this.belongsTo(
      () => ProductsNutritionalInformationsGroupsTable,
      {
        columns: ["productNutritionalInformationGroupId"],
        references: ["id"],
      }
    ),
    ingredientsProductsFlavors: this.hasMany(
      () => IngredientsProductsFlavorsTable,
      {
        columns: ["id"],
        references: ["productFlavorId"],
      }
    ),
  };
}
