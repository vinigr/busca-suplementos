import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { generateSlug } from "../../helpers/generateSlug";

export const ingredientsProductsFlavors = new Elysia({
  prefix: "/ingredients-products-flavors",
})
  .post(
    "/",
    async ({ body }) => {
      const slug = generateSlug(body.ingredientName.trim());

      const ingredient = await db.ingredients
        .findByOptional({ slug })
        .select("id");

      let ingredientId = ingredient?.id;

      if (!ingredient) {
        const ingredientInsert = await db.ingredients.create({
          name: body.ingredientName.trim(),
          slug,
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

            const slug = generateSlug(ingredientName);

            const treatedIngredient =
              ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);

            const ingredientExist = await db.ingredients
              .findByOptional({ slug })
              .select("id");

            let ingredientId = ingredientExist?.id;

            if (!ingredientExist) {
              const ingredientInsert = await db.ingredients.create({
                name: treatedIngredient,
                slug,
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
  .post(
    "/clone",
    async ({ body }) => {
      console.log("aqui");

      const ingredientsProductClone = await db.ingredientsProductsFlavors
        .where({ productFlavorId: body.productFlavorIdClone })
        .select("ingredientId", "capsule")
        .order({
          order: "ASC",
        });

      await db.$transaction(async () => {
        await Promise.all(
          ingredientsProductClone.map(async (ingredient, index) => {
            await db.ingredientsProductsFlavors.insert({
              ingredientId: ingredient.ingredientId,
              productFlavorId: body.productFlavorId,
              order: index + 1,
              capsule: ingredient.capsule,
            });
          })
        );
      });
    },
    {
      body: t.Object({
        productFlavorId: t.Numeric({ error: "Sabor do produto não informado" }),
        productFlavorIdClone: t.Numeric({
          error: "Sabor de produto para clonar ingredientes não informado",
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
