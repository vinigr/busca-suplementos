import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const stampsAdminRoutes = new Elysia({ prefix: "/stamps" })
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.stamps
        .select("id", "name")
        .limit(Number(size))
        .order("id")
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const stamps = await query;

      let countStamps = db.stamps.count();

      if (search) {
        countStamps = countStamps.where({
          name: { contains: String(search) },
        });
      }

      const resultCountStamps = await countStamps;

      const pageCount = Math.ceil(resultCountStamps / Number(size));

      return {
        data: stamps,
        total: resultCountStamps,
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
      return await db.stamps.insert({ name: body.name.trim() });
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
      return await db.stamps.where({ id }).update({ name: body.name.trim() });
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
      return await db.stamps.findByOptional({ id }).select("id", "name");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get("/list", async () => {
    return await db.stamps.select("id", "name").order("id");
  });
