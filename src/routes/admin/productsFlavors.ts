import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { generateRandomString } from "../../helpers/generateRandomString";
import sharp from "sharp";

export const productsFlavorsRoutes = new Elysia({
  prefix: "/products-flavors",
})
  .post(
    "/",
    async ({ body }) => {
      const productIsProtein = await db.products
        .where({ id: body.productId })
        .join("productsTypes", (q) =>
          q.where({ "productsTypes.slug": "proteinas" })
        )
        .select(
          "products.id",
          "products.portion",
          "products.weight",
          "products.cashPrice"
        )
        .findByOptional();

      let proteinTotal = null;
      let proteinGramPrice = null;

      if (productIsProtein) {
        const quantityProtein = await db.productsNutritionalInformations
          .where({
            productNutritionalInformationGroupId:
              body.productNutritionalInformationGroupId,
          })
          .join("nutritionalInformations", (q) =>
            q.where({ "nutritionalInformations.name": "Proteínas" })
          )
          .select("productsNutritionalInformations.quantity")
          .findByOptional();

        if (
          productIsProtein.weight &&
          productIsProtein.portion &&
          productIsProtein.cashPrice &&
          quantityProtein?.quantity
        ) {
          proteinTotal =
            (productIsProtein.weight / productIsProtein.portion) *
            quantityProtein.quantity;

          proteinGramPrice = productIsProtein.cashPrice / proteinTotal;
        }
      }

      const { id } = await db.productsFlavors.create({
        ...body,
        link: body.link || null,
        proteinTotal,
        proteinGramPrice,
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
      const productIsProtein = await db.products
        .where({ id: body.productId })
        .join("productsTypes", (q) =>
          q.where({ "productsTypes.slug": "proteinas" })
        )
        .select(
          "products.id",
          "products.portion",
          "products.weight",
          "products.cashPrice"
        )
        .findByOptional();

      let proteinTotal = null;
      let proteinGramPrice = null;

      if (productIsProtein) {
        const quantityProtein = await db.productsNutritionalInformations
          .where({
            productNutritionalInformationGroupId:
              body.productNutritionalInformationGroupId,
          })
          .join("nutritionalInformations", (q) =>
            q.where({ "nutritionalInformations.name": "Proteínas" })
          )
          .select("productsNutritionalInformations.quantity")
          .findByOptional();

        if (
          productIsProtein.weight &&
          productIsProtein.portion &&
          productIsProtein.cashPrice &&
          quantityProtein?.quantity
        ) {
          proteinTotal =
            (productIsProtein.weight / productIsProtein.portion) *
            quantityProtein.quantity;

          proteinGramPrice = productIsProtein.cashPrice / proteinTotal;
        }
      }

      return await db.productsFlavors.where({ id }).update({
        ...body,
        link: body.link || null,
        proteinTotal,
        proteinGramPrice,
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
        .select("id", "order", "capsule", {
          ingredient: (q) => q.ingredient.select("id", "name"),
        })
        .order("order");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/:id/upload",
    async ({ body, params: { id } }) => {
      const nameFile = `${generateRandomString(12)}.png`;

      const image = await sharp(await body.image.arrayBuffer())
        .toFormat("png", { quality: 80 })
        .toBuffer();

      await Bun.write(`./public/products/${nameFile}`, image);

      return await db.productsFlavors
        .where({ id })
        .update({ urlImage: nameFile });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        image: t.File(),
      }),
    }
  )
  .get(
    "/search/:search",
    async ({ params: { search } }) => {
      return await db.productsFlavors
        .join("product")
        .join("flavor")
        .where({ "flavor.name": { contains: search } })
        .orWhere({ "product.name": { contains: search } })
        .select("id", "flavor.name", {
          product: (q) => q.product.select("name"),
        });
    },
    {
      params: t.Object({
        search: t.String(),
      }),
    }
  );
