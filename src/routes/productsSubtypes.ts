import { Elysia, t } from "elysia";
import { db } from "../db/db";

export const productsSubtypesRoutes = new Elysia({
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
  );
