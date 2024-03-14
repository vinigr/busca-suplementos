import { BaseTable } from "../baseTable";
import { ProductsSubtypesTable } from "./productsSubtypes.table";
import { ProductsTable } from "./products.table";

export class ProductsTypesTable extends BaseTable {
  readonly table = "productsTypes";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    productsSubtypes: this.hasMany(() => ProductsSubtypesTable, {
      columns: ["id"],
      references: ["productTypeId"],
    }),
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["productTypeId"],
    }),
  };
}
