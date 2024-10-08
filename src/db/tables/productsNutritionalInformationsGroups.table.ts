import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";

export class ProductsNutritionalInformationsGroupsTable extends BaseTable {
  readonly table = "productsNutritionalInformationsGroups";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productId: t.integer().foreignKey("products", "id"),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    product: this.belongsTo(() => ProductsTable, {
      columns: ["productId"],
      references: ["id"],
    }),
    productsNutritionalInformations: this.hasMany(
      () => ProductsNutritionalInformationsTable,
      {
        columns: ["id"],
        references: ["productNutritionalInformationGroupId"],
      }
    ),
  };
}
