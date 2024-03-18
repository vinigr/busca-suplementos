import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsNutritionalInformationsRoutes = new Elysia({
  prefix: "/products-nutritional-informations",
})
  .post(
    "/",
    async ({ body }) => {
      const nutritionalInformation = await db.nutritionalInformations
        .findByOptional({ name: body.nutritionalInformationName.trim() })
        .select("id");

      let nutritionalInformationId = nutritionalInformation?.id;

      if (!nutritionalInformation) {
        const nutritionalInformationInsert =
          await db.nutritionalInformations.create({
            name: body.nutritionalInformationName.trim(),
          });

        nutritionalInformationId = nutritionalInformationInsert.id;
      }

      await db.productsNutritionalInformations.insert({
        productId: body.productId,
        productNutritionalInformationGroupId:
          body.productNutritionalInformationGroupId,
        nutritionalInformationId,
        order: body.order,
        productNutritionalInformationId: body.productNutritionalInformationId,
        percentageDaily: body.percentageDaily,
        quantity: body.quantity,
        unitsMeasurement: body.unitsMeasurement,
        isSubItem: Boolean(body.productNutritionalInformationId),
      });
    },
    {
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        nutritionalInformationName: t.String({
          error: "Informação nutricional não informada",
        }),
        productNutritionalInformationGroupId: t.Numeric({
          error: "Grupo não informado",
        }),
        order: t.Numeric({ error: "Ordem não informada" }),
        productNutritionalInformationId: t.Nullable(t.Optional(t.Numeric())),
        percentageDaily: t.Optional(t.Numeric()),
        quantity: t.Numeric({ error: "Quantidade não informada" }),
        unitsMeasurement: t.Nullable(t.Optional(t.Numeric())),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      return await db.productsNutritionalInformations.where({ id }).delete();
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
