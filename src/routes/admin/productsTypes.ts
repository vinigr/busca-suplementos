import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsTypesAdminRoutes = new Elysia({
  prefix: "/products-types",
})
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.productsTypes
        .select("id", "name")
        .limit(Number(size))
        .order("id")
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const productsTypes = await query;

      let countProductsTypes = db.productsTypes.count();

      if (search) {
        countProductsTypes = countProductsTypes.where({
          name: { contains: String(search) },
        });
      }

      const resultCountProductsTypes = await countProductsTypes;

      const pageCount = Math.ceil(resultCountProductsTypes / Number(size));

      return {
        data: productsTypes,
        total: resultCountProductsTypes,
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
      return await db.productsTypes.insert({ name: body.name.trim() });
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
      return await db.productsTypes
        .where({ id })
        .update({ name: body.name.trim() });
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
      return await db.productsTypes.findByOptional({ id }).select("id", "name");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get("/list", async () => {
    return await db.productsTypes.select("id", "name").order("id");
  })
  .get(
    "/:id/subtypes",
    async ({ params: { id }, query: { page, size, search } }) => {
      let query = db.productsSubtypes
        .select("id", "name")
        .where({ productTypeId: id })
        .limit(Number(size))
        .order("id")
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const productsSubtypes = await query;

      let countProductsSubtypes = db.productsSubtypes.count();

      if (search) {
        countProductsSubtypes = countProductsSubtypes.where({
          name: { contains: String(search) },
        });
      }

      const resultCountProductsSubtypes = await countProductsSubtypes;

      const pageCount = Math.ceil(resultCountProductsSubtypes / Number(size));

      return {
        data: productsSubtypes,
        total: resultCountProductsSubtypes,
        page,
        pageCount,
      };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  );
