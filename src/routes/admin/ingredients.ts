import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const ingredientsRoutes = new Elysia({
  prefix: "/ingredients",
}).get(
  "/",
  async ({ query: { search } }) => {
    return await db.ingredients
      .select("id", "name")
      .where({ name: { contains: String(search) } })
      .order("name");
  },
  {
    query: t.Object({
      search: t.String(),
    }),
  }
);
