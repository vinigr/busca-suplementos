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
        nutritionalInformationId: Number(nutritionalInformationId),
        order: body.order,
        productNutritionalInformationId: body.productNutritionalInformationId,
        percentageDaily: body.percentageDaily,
        quantity: body.quantity,
        unitMeasurementId: body.unitMeasurementId,
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
        productNutritionalInformationId: t.Optional(t.Nullable(t.Numeric())),
        percentageDaily: t.Optional(t.Nullable(t.Numeric())),
        quantity: t.Numeric({ error: "Quantidade não informada" }),
        unitMeasurementId: t.Optional(t.Nullable(t.Numeric())),
      }),
    }
  )
  .post(
    "/multiples",
    async ({ body }) => {
      const nutritionalInformations = JSON.parse(
        body.nutritionalInformationText
      );

      await db.$transaction(async () => {
        await Promise.all(
          nutritionalInformations.map(
            async (nutritrionalInformation: any, index: number) => {
              const name =
                nutritrionalInformation.nutritionalInformation.trim();

              const treatedNutritionalInformation =
                name.charAt(0).toUpperCase() + name.slice(1);

              const nutritionalInformation = await db.nutritionalInformations
                .findByOptional({ name: treatedNutritionalInformation })
                .select("id");

              let nutritionalInformationId = nutritionalInformation?.id;

              if (!nutritionalInformation) {
                const nutritionalInformationInsert =
                  await db.nutritionalInformations.create({
                    name: treatedNutritionalInformation,
                  });

                nutritionalInformationId = nutritionalInformationInsert.id;
              }

              const unitMeasurementText = nutritrionalInformation.unit.replace(
                /[^a-zA-Z]+/g,
                ""
              );

              const quantity = nutritrionalInformation.unit
                .match(/^[0-9,\.]+/, "")[0]
                .replace(",", ".");

              const unitMeasurement = await db.unitsMeasurements
                .findByOptional({ name: unitMeasurementText })
                .select("id");

              await db.productsNutritionalInformations.insert({
                productId: body.productId,
                productNutritionalInformationGroupId:
                  body.productNutritionalInformationGroupId,
                nutritionalInformationId: Number(nutritionalInformationId),
                order: index + 1,
                productNutritionalInformationId:
                  body.productNutritionalInformationId,
                percentageDaily: nutritrionalInformation.vd || null,
                quantity,
                unitMeasurementId: unitMeasurement?.id || null,
                isSubItem: Boolean(body.productNutritionalInformationId),
              });
            }
          )
        );
      });

      // console.log({ nutritionalInformations });
    },
    {
      body: t.Object({
        productId: t.Numeric({ error: "Produto não informado" }),
        productNutritionalInformationGroupId: t.Numeric({
          error: "Grupo não informado",
        }),
        nutritionalInformationText: t.String({
          error: "Informações nutricionais não informadas",
        }),
        productNutritionalInformationId: t.Nullable(t.Optional(t.Numeric())),
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
