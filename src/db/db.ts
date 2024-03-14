import { orchidORM } from "orchid-orm";
import { config } from "../config";
import { CompaniesTable } from "./tables/companies.table";
import { ProductsTypesTable } from "./tables/productsTypes.table";
import { ProductsSubtypesTable } from "./tables/productsSubtypes.table";
import { FlavorsTable } from "./tables/flavors.table";
import { IngredientsTable } from "./tables/ingredients.table";
import { NutritionalInformationsTable } from "./tables/nutritionalInformations.table";
import { StampsTable } from "./tables/stamps.table";
import { ProductsTable } from "./tables/products.table";
import { ProductsNutritionalInformationsTable } from "./tables/productsNutritionalInformations.table";
import { ProductsFlavorsTable } from "./tables/productsFlavors.table";
import { IngredientsProductsFlavorsTable } from "./tables/ingredientsProductsFlavors.table";
import { UsersTable } from "./tables/users.table";

export const db = orchidORM(config.database, {
  companies: CompaniesTable,
  productsTypes: ProductsTypesTable,
  productsSubtypes: ProductsSubtypesTable,
  flavors: FlavorsTable,
  ingredients: IngredientsTable,
  nutritionalInformations: NutritionalInformationsTable,
  stamps: StampsTable,
  products: ProductsTable,
  productsNutritionalInformations: ProductsNutritionalInformationsTable,
  productsFlavors: ProductsFlavorsTable,
  ingredientsProductsFlavors: IngredientsProductsFlavorsTable,
  users: UsersTable,
});
