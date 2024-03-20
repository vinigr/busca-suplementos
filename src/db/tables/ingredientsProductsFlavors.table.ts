import { BaseTable } from "../baseTable";
import { IngredientsTable } from "./ingredients.table";
import { ProductsFlavorsTable } from "./productsFlavors.table";

export class IngredientsProductsFlavorsTable extends BaseTable {
  readonly table = "ingredientsProductsFlavors";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    ingredientId: t.integer().foreignKey("ingredients", "id"),
    productFlavorId: t.integer().foreignKey("productsFlavors", "id"),
    order: t.integer(),
    ...t.timestampsNoTZ(),
  }));

  relations = {
    ingredient: this.belongsTo(() => IngredientsTable, {
      columns: ["ingredientId"],
      references: ["id"],
    }),
    productsFlavors: this.belongsTo(() => ProductsFlavorsTable, {
      columns: ["productFlavorId"],
      references: ["id"],
    }),
  };
}
