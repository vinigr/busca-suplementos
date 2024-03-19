import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";
import { FlavorsTable } from "./flavors.table";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";
import { IngredientsProductsFlavorsTable } from "./ingredientsProductsFlavors.table";

export class ProductsFlavorsTable extends BaseTable {
  readonly table = "productsFlavors";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    flavorId: t.integer().foreignKey("flavors", "id"),
    link: t.varchar().nullable(),
    containsGluten: t.boolean(),
    containsLactose: t.boolean(),
    containsSoyDerivatives: t.boolean(),
    containsMilkDerivatives: t.boolean(),
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id"),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    products: this.belongsTo(() => ProductsTable, {
      columns: ["productId"],
      references: ["id"],
    }),
    flavor: this.belongsTo(() => FlavorsTable, {
      columns: ["flavorId"],
      references: ["id"],
    }),
    productNutritionalInformations: this.belongsTo(
      () => ProductsNutritionalInformationsTable,
      {
        columns: ["productNutritionalInformationId"],
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
