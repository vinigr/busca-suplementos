import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsSubtypesAdminRoutes = new Elysia({
  prefix: "/products-subtypes",
})
  .post(
    "/",
    async ({ body }) => {
      return await db.productsSubtypes.insert({
        name: body.name.trim(),
        productTypeId: body.productTypeId,
      });
    },
    {
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        productTypeId: t.Numeric({ error: "Tipo de produto não informado" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.productsSubtypes
        .where({ id })
        .update({ name: body.name.trim(), productTypeId: body.productTypeId });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        productTypeId: t.Numeric({ error: "Tipo de produto não informado" }),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.productsSubtypes
        .findByOptional({ id })
        .select("id", "name", "productTypeId");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
