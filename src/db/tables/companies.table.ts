import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";

export class CompaniesTable extends BaseTable {
  readonly table = "companies";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    active: t.boolean().default(true),
    urlImage: t.varchar().nullable(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    products: this.hasMany(() => ProductsTable, {
      columns: ["id"],
      references: ["companyId"],
    }),
  };
}
