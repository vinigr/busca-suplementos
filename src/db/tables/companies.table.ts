import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";

export class CompaniesTable extends BaseTable {
  readonly table = "companies";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    active: t.boolean().default(true),
    urlImage: t.varchar().nullable(),
    slug: t.varchar().unique(),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["companyId"],
    }),
  };
}
