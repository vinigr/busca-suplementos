import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";

export class StampsTable extends BaseTable {
  readonly table = "stamps";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["stampId"],
    }),
  };
}
