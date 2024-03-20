import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const flavorsAdminRoutes = new Elysia({ prefix: "/flavors" })
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.flavors
        .select("id", "name")
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const flavors = await query;

      let countFlavors = db.flavors.count();

      if (search) {
        countFlavors = countFlavors.where({
          name: { contains: String(search) },
        });
      }

      const resultCountFlavors = await countFlavors;

      const pageCount = Math.ceil(resultCountFlavors / Number(size));

      return {
        data: flavors,
        total: resultCountFlavors,
        page,
        pageCount,
      };
    },
    {
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/",
    async ({ body }) => {
      return await db.flavors.insert({ name: body.name });
    },
    {
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.flavors.where({ id }).update({ name: body.name });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.flavors.findByOptional({ id }).select("id", "name");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get("/list", async () => {
    return await db.flavors.select("id", "name").order("name");
  });
