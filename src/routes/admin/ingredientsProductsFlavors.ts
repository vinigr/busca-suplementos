import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { set } from "valibot";

export const ingredientsProductsFlavors = new Elysia({
  prefix: "/ingredients-products-flavors",
})
  .post(
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
        capsule: body.capsule,
      });
    },
    {
      body: t.Object({
        productFlavorId: t.Numeric({ error: "Sabor do produto não informado" }),
        ingredientName: t.String({
          error: "Ingrediente não informado",
        }),
        order: t.Numeric({ error: "Ordem não informada" }),
        capsule: t.Boolean({
          error: "Não foi informado se é ingrediente de cápsula",
        }),
      }),
    }
  )
  .post(
    "/multiples",
    async ({ body, set }) => {
      const lastIngredientOrder = await db.ingredientsProductsFlavors
        .where({ productFlavorId: body.productFlavorId })
        .select("order")
        .order({
          order: "DESC",
        })
        .findByOptional();

      const lastOrder = lastIngredientOrder ? lastIngredientOrder.order : 0;

      await db.$transaction(async () => {
        await Promise.all(
          body.ingredientsNames.split(",").map(async (ingredient, index) => {
            const ingredientName = ingredient.trim().replaceAll(";", ",");

            const treatedIngredient =
              ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);

            const ingredientExist = await db.ingredients
              .findByOptional({ name: treatedIngredient })
              .select("id");

            let ingredientId = ingredientExist?.id;

            if (!ingredientExist) {
              const ingredientInsert = await db.ingredients.create({
                name: treatedIngredient,
              });
              ingredientId = ingredientInsert.id;
            }

            await db.ingredientsProductsFlavors.insert({
              ingredientId,
              productFlavorId: body.productFlavorId,
              order: lastOrder + index + 1,
              capsule: body.capsule,
            });
          })
        );
      });
    },
    {
      body: t.Object({
        productFlavorId: t.Numeric({ error: "Sabor do produto não informado" }),
        ingredientsNames: t.String({
          error: "Ingredientes não informados",
        }),
        capsule: t.Boolean({
          error: "Não foi informado se é ingrediente de cápsula",
        }),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      return await db.ingredientsProductsFlavors.where({ id }).delete();
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
