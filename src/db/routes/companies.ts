import { Elysia, t } from "elysia";
import { db } from "../db";

export const companiesRoutes = new Elysia({ prefix: "/companies" })
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.companies
        .select("id", "name", "active")
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const categories = await query;

      let countCategories = db.products.count();

      if (search) {
        countCategories = countCategories.where({
          name: { contains: String(search) },
        });
      }

      const resultCountCategories = await countCategories;

      const pageCount = Math.ceil(resultCountCategories / Number(size));

      return {
        data: categories,
        total: resultCountCategories,
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
      return await db.companies.insert({ name: body.name });
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
      return await db.companies.where({ id }).update({ name: body.name });
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
      return await db.companies
        .findByOptional({ id })
        .select("id", "name", "active", "urlImage");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
