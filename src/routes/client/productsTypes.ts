import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsTypesClientRoutes = new Elysia({
  prefix: "/products-types",
}).get("/", async () => {
  return await db.productsTypes
    .select("slug", "name", {
      subtypes: (q) => q.productsSubtypes.select("slug", "name"),
    })
    .order("name");
});
