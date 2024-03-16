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
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id"),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    products: this.belongsTo(() => ProductsTable, {
      columns: ["productId"],
      references: ["id"],
    }),
    flavors: this.belongsTo(() => FlavorsTable, {
      columns: ["flavorId"],
      references: ["id"],
    }),
    productsNutritionalInformations: this.belongsTo(
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
