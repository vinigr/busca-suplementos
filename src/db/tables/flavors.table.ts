import { BaseTable } from "../baseTable";
import { ProductsFlavorsTable } from "./productsFlavors.table";

export class FlavorsTable extends BaseTable {
  readonly table = "flavors";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    productsFlavors: this.hasMany(() => ProductsFlavorsTable, {
      columns: ["id"],
      references: ["flavorId"],
    }),
  };
}
