import { Elysia, t } from "elysia";
import { db } from "../../db/db";

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
      });
    },
    {
      body: t.Object({
        productFlavorId: t.Numeric({ error: "Sabor do produto não informado" }),
        ingredientName: t.String({
          error: "Ingrediente não informado",
        }),
        order: t.Numeric({ error: "Ordem não informada" }),
      }),
    }
  )
  .post(
    "/multiples",
    async ({ body }) => {
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
              order: index + 1,
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
      }),
    }
  )
  .post(
    "/multiples-capsules",
    async ({ body }) => {
      await db.$transaction(async () => {
        const lastIngredientOrder = await db.ingredientsProductsFlavors
          .where({ productFlavorId: body.productFlavorId })
          .select("order")
          .findByOptional();

        const lastOrder = lastIngredientOrder ? lastIngredientOrder.order : 0;

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
              capsule: true,
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
