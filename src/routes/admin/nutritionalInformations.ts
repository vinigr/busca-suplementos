import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const nutritionalInformationsRoutes = new Elysia({
  prefix: "/nutritional-informations",
}).get(
  "/",
  async ({ query: { search } }) => {
    return await db.nutritionalInformations
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
