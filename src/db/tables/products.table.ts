import { BaseTable } from "../baseTable";
import { ProductsTypesTable } from "./productsTypes.table";
import { ProductsSubtypesTable } from "./productsSubtypes.table";
import { CompaniesTable } from "./companies.table";
import { StampsTable } from "./stamps.table";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";
import { ProductsFlavorsTable } from "./productsFlavors.table";

export class ProductsTable extends BaseTable {
  readonly table = "products";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    productTypeId: t.integer().foreignKey("productsTypes", "id"),
    productSubtypeId: t
      .integer()
      .foreignKey("productsSubtypes", "id")
      .nullable(),
    companyId: t.integer().foreignKey("companies", "id"),
    portion: t.integer().nullable(),
    weigth: t.integer().nullable(),
    capsules: t.integer().nullable(),
    unitsMeasurement: t.integer(),
    stampId: t.integer().foreignKey("stamps", "id").nullable(),
    urlImage: t.varchar().nullable(),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    productsTypes: this.belongsTo(() => ProductsTypesTable, {
      columns: ["productTypeId"],
      references: ["id"],
    }),
    productsSubtypes: this.belongsTo(() => ProductsSubtypesTable, {
      columns: ["productSubtypeId"],
      references: ["id"],
    }),
    companies: this.belongsTo(() => CompaniesTable, {
      columns: ["companyId"],
      references: ["id"],
    }),
    stamps: this.belongsTo(() => StampsTable, {
      columns: ["stampId"],
      references: ["id"],
    }),
    productsNutritionalInformations: this.hasMany(
      () => ProductsNutritionalInformationsTable,
      {
        columns: ["id"],
        references: ["productId"],
      }
    ),
    productsFlavors: this.hasMany(() => ProductsFlavorsTable, {
      columns: ["id"],
      references: ["productId"],
    }),
  };
}
