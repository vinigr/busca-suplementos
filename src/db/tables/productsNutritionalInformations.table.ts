import { BaseTable } from "../baseTable";
import { ProductsTable } from "./products.table";
import { NutritionalInformationsTable } from "./nutritionalInformations.table";
import { ProductsFlavorsTable } from "./productsFlavors.table";
import { UnitsMeasurementsTable } from "./unitsMeasurements.table";

export class ProductsNutritionalInformationsTable extends BaseTable {
  readonly table = "productsNutritionalInformations";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    productId: t.integer().foreignKey("products", "id"),
    nutritionalInformationId: t
      .integer()
      .foreignKey("nutritionalInformations", "id"),
    order: t.integer(),
    quantity: t.real(),
    unitMeasurementId: t
      .integer()
      .foreignKey("unitsMeasurements", "id")
      .nullable(),
    percentageDaily: t.real().nullable(),
    productNutritionalInformationId: t
      .integer()
      .foreignKey("productsNutritionalInformations", "id")
      .nullable(),
    isSubItem: t.boolean().default(false),
    productNutritionalInformationGroupId: t
      .integer()
      .foreignKey("productsNutritionalInformationsGroups", "id"),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    products: this.belongsTo(() => ProductsTable, {
      columns: ["productId"],
      references: ["id"],
    }),
    nutritionalInformations: this.belongsTo(
      () => NutritionalInformationsTable,
      {
        columns: ["nutritionalInformationId"],
        references: ["id"],
      }
    ),
    productsNutritionalInformations: this.belongsTo(
      () => ProductsNutritionalInformationsTable,
      {
        columns: ["productNutritionalInformationId"],
        references: ["id"],
      }
    ),
    unitMeasurement: this.belongsTo(() => UnitsMeasurementsTable, {
      columns: ["unitMeasurementId"],
      references: ["id"],
    }),
  };
}
