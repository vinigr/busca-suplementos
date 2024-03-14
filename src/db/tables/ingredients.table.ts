import { BaseTable } from "../baseTable";
import { IngredientsProductsFlavorsTable } from "./ingredientsProductsFlavors.table";

export class IngredientsTable extends BaseTable {
  readonly table = "ingredients";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    name: t.varchar(),
    description: t.varchar().nullable(),
    isSweetener: t.boolean().default(false),
    isSugar: t.boolean().default(false),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));

  relations = {
    ingredientsProductsFlavors: this.hasMany(
      () => IngredientsProductsFlavorsTable,
      {
        columns: ["id"],
        references: ["ingredientId"],
      }
    ),
  };
}
