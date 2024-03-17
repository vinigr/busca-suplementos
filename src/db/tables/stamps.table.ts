import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";

export class StampsTable extends BaseTable {
  readonly table = "stamps";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["stampId"],
    }),
  };
}
