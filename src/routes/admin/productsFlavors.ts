import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsFlavorsRoutes = new Elysia({
  prefix: "/products-flavors",
})
  .post(
    "/",
    async ({ body }) => {
      await db.productsFlavors.insert({
        ...body,
      });
    },
    {
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        flavorId: t.Numeric({
          error: "Sabor não informado",
        }),
        containsGluten: t.Boolean({
          error: "Não foi informado se contem glúten",
        }),
        containsLactose: t.Boolean({
          error: "Não foi informado se contem lactose",
        }),
        containsSoyDerivatives: t.Boolean({
          error: "Não foi informado se contem derivados de soja",
        }),
        containsMilkDerivatives: t.Boolean({
          error: "Não foi informado se contem derivados de leite",
        }),
        link: t.Nullable(t.Optional(t.String())),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.productsFlavors.where({ id }).update({
        ...body,
      });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        flavorId: t.Numeric({
          error: "Sabor não informado",
        }),
        containsGluten: t.Boolean({
          error: "Não foi informado se contem glúten",
        }),
        containsLactose: t.Boolean({
          error: "Não foi informado se contem lactose",
        }),
        containsSoyDerivatives: t.Boolean({
          error: "Não foi informado se contem derivados de soja",
        }),
        containsMilkDerivatives: t.Boolean({
          error: "Não foi informado se contem derivados de leite",
        }),
        link: t.Nullable(t.Optional(t.String())),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      return await db.productsFlavors.where({ id }).delete();
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
