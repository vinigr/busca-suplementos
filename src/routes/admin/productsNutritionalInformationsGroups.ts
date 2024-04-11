import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsNutritionalInformationsGroupsRoutes = new Elysia({
  prefix: "/products-nutritional-informations-groups",
})
  .post(
    "/",
    async ({ body }) => {
      const { id: productNutritionalInformationsGroupId } =
        await db.productsNutritionalInformationsGroups.create({
          name: body.name,
          productId: body.productId,
        });

      return { productNutritionalInformationsGroupId };
    },
    {
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        productId: t.Numeric({ error: "Produto não informado" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.productsNutritionalInformationsGroups
        .where({ id })
        .update({
          name: body.name,
          productId: body.productId,
        });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        productId: t.Numeric({ error: "Produto não informado" }),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.productsNutritionalInformationsGroups
        .findByOptional({ id })
        .select("id", "name", "productId");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/:id/products-nutritional-informations",
    async ({ params: { id } }) => {
      return await db.productsNutritionalInformations
        .where({ productNutritionalInformationGroupId: id })
        .select(
          "id",
          "productId",
          "quantity",
          "productNutritionalInformationId",
          "unitMeasurementId",
          "percentageDaily",
          "order",
          "isSubItem",
          {
            unitMeasurement: (q) => q.unitMeasurement.select("name"),
            nutritionalInformation: (q) =>
              q.nutritionalInformations.select("id", "name"),
            productsNutritionalInformations: (q) =>
              q.productsNutritionalInformations.select("id", {
                nutritionalInformation: (q) =>
                  q.nutritionalInformations.select("id", "name"),
              }),
          }
        )
        .order("order");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/search/:search",
    async ({ params: { search } }) => {
      return await db.productsNutritionalInformationsGroups
        .join("product")
        .where({ name: { contains: search } })
        .orWhere({ "product.name": { contains: search } })
        .select("id", "name", {
          product: (q) => q.product.select("name"),
        });
    },
    {
      params: t.Object({
        search: t.String(),
      }),
    }
  );
