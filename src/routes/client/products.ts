import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsClientRoutes = new Elysia({
  prefix: "/products",
}).get(
  ":slug",
  async ({ params: { slug } }) => {
    const product = await db.products
      .findByOptional({ slug })
      .select(
        "slug",
        "name",
        "urlImage",
        "portion",
        "weight",
        "capsules",
        "cashPrice",
        "link",
        "priceDose",
        "installmentPrice",
        "form",
        {
          company: (q) => q.companies.select("slug", "name"),
          flavors: (q) =>
            q.productsFlavors.select(
              "id",
              "link",
              "productNutritionalInformationGroupId",
              {
                flavor: (q) => q.flavor.select("name"),
                ingredients: (q) =>
                  q.ingredientsProductsFlavors.select("order", {
                    ingredient: (q) => q.ingredient.select("name"),
                  }),
              }
            ),
          nutritionalInformations: (q) =>
            q.productsNutritionalInformationsGroups.select("id", {
              informations: (q) =>
                q.productsNutritionalInformations
                  .select("id", "order", "percentageDaily", "quantity", {
                    unitMeasurement: (q) => q.unitMeasurement.select("name"),
                    information: (q) =>
                      q.nutritionalInformations.select("name"),
                  })
                  .order("order"),
            }),
        }
      );

    return product;
  },
  {
    params: t.Object({
      slug: t.String(),
    }),
  }
);
