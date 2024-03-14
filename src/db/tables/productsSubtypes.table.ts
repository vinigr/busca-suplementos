import { BaseTable } from "../baseTable";
import { ProductsTypesTable } from "./productsTypes.table";
import { ProductsTable } from "./products.table";

export class ProductsSubtypesTable extends BaseTable {
  readonly table = "productsSubtypes";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productTypeId: t.integer().foreignKey("productsTypes", "id"),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    productsTypes: this.belongsTo(() => ProductsTypesTable, {
      columns: ["productTypeId"],
      references: ["id"],
    }),
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["productSubtypeId"],
    }),
  };
}
