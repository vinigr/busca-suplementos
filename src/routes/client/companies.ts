import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const companiesClientRoutes = new Elysia({
  prefix: "/companies",
}).get("images", async () => {
  return db.companies
    .where({ active: true })
    .select("slug", "name", "urlImage")
    .order("slug");
});
