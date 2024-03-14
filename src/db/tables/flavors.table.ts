import { BaseTable } from "../baseTable";
import { ProductsFlavorsTable } from "./productsFlavors.table";

export class FlavorsTable extends BaseTable {
  readonly table = "flavors";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    productsFlavors: this.hasMany(() => ProductsFlavorsTable, {
      columns: ["id"],
      references: ["flavorId"],
    }),
  };
}
