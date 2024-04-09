import { BaseTable } from "../baseTable";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";

export class NutritionalInformationsTable extends BaseTable {
  readonly table = "nutritionalInformations";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    slug: t.varchar().index(),
    ...t.timestampsNoTZ(),
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
