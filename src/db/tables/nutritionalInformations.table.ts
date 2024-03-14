import { BaseTable } from "../baseTable";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";

export class NutritionalInformationsTable extends BaseTable {
  readonly table = "nutritionalInformations";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    productsNutritionalInformations: this.hasMany(
      () => ProductsNutritionalInformationsTable,
      {
        columns: ["id"],
        references: ["nutritionalInformationId"],
      }
    ),
  };
}
