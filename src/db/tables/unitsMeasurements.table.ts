import { BaseTable } from "../baseTable";

export class UnitsMeasurementsTable extends BaseTable {
  readonly table = "unitsMeasurements";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    ...t.timestampsNoTZ(),
  }));
}
