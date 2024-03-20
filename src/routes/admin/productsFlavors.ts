import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsFlavorsRoutes = new Elysia({
  prefix: "/products-flavors",
})
  .post(
    "/",
    async ({ body }) => {
      const { id } = await db.productsFlavors.create({
        ...body,
        link: body.link || null,
      });

      return { productFlavorId: id };
    },
    {
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        flavorId: t.Numeric({
          error: "Sabor não informado",
        }),
        productNutritionalInformationGroupId: t.Numeric({
          error: "Informação nutricional não informada",
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
        link: body.link || null,
      });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        productNutritionalInformationGroupId: t.Numeric({
          error: "Informação nutricional não informada",
        }),
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
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.productsFlavors
        .findByOptional({ id })
        .select(
          "id",
          "flavorId",
          "productNutritionalInformationGroupId",
          "link",
          "containsGluten",
          "containsLactose",
          "containsMilkDerivatives",
          "containsSoyDerivatives"
        );
    },
    {
      params: t.Object({
        id: t.Numeric(),
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
  )
  .get(
    "/:id/ingredients",
    async ({ params: { id } }) => {
      return await db.ingredientsProductsFlavors
        .where({ productFlavorId: id })
        .select("id", "order", {
          ingredient: (q) => q.ingredient.select("id", "name"),
        })
        .order("order");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
