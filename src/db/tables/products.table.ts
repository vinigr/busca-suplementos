import { BaseTable } from "../baseTable";
import { ProductsTypesTable } from "./productsTypes.table";
import { ProductsSubtypesTable } from "./productsSubtypes.table";
import { CompaniesTable } from "./companies.table";
import { StampsTable } from "./stamps.table";
import { ProductsNutritionalInformationsTable } from "./productsNutritionalInformations.table";
import { ProductsFlavorsTable } from "./productsFlavors.table";
import { ProductsNutritionalInformationsGroupsTable } from "./productsNutritionalInformationsGroups.table";

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
    portion: t.real().nullable(),
    weight: t.real().nullable(),
    capsules: t.integer().nullable(),
    form: t.integer(),
    stampId: t.integer().foreignKey("stamps", "id").nullable(),
    urlImage: t.varchar().nullable(),
    link: t.varchar().nullable(),
    slug: t.varchar().unique(),
    priceDose: t.real().nullable(),
    cashPrice: t.integer().nullable(),
    installmentPrice: t.integer().nullable(),
    cashPriceSelectorHTML: t.varchar().nullable(),
    installmentPriceSelectorHTML: t.varchar().nullable(),
    ...t.timestampsNoTZ(),
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
    productsNutritionalInformationsGroups: this.hasMany(
      () => ProductsNutritionalInformationsGroupsTable,
      {
        columns: ["id"],
        references: ["productId"],
      }
    ),
  };
}
