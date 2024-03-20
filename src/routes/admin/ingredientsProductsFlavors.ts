import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const ingredientsProductsFlavors = new Elysia({
  prefix: "/ingredients-products-flavors",
}).post(
  "/",
  async ({ body }) => {
    const ingredient = await db.ingredients
      .findByOptional({ name: body.ingredientName.trim() })
      .select("id");

    let ingredientId = ingredient?.id;

    if (!ingredient) {
      const ingredientInsert = await db.ingredients.create({
        name: body.ingredientName.trim(),
      });

      ingredientId = ingredientInsert.id;
    }

    await db.ingredientsProductsFlavors.insert({
      ingredientId,
      productFlavorId: body.productFlavorId,
      order: body.order,
    });
  },
  {
    body: t.Object({
      productFlavorId: t.Numeric({ error: "Sabor do produto não informado" }),
      ingredientName: t.String({
        error: "Informação nutricional não informada",
      }),
      order: t.Numeric({ error: "Ordem não informada" }),
    }),
  }
);
