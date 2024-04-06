import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const companiesClientRoutes = new Elysia({
  prefix: "/companies",
})
  .get("images", async () => {
    return db.companies
      .where({ active: true })
      .select("slug", "name", "urlImage")
      .order("slug");
  })
  .get(
    ":slug/products",
    async ({ params: { slug }, set }) => {
      const company = await db.companies
        .findByOptional({ slug, active: true })
        .select("id");

      if (!company) {
        set.status = 404;

        return { error: "Marca não encontrada" };
      }

      const productsTypesCompany = await db.products
        .where({ companyId: company.id })
        .select("productTypeId");

      if (!productsTypesCompany.length) {
        return [];
      }

      const productsTypesIds = productsTypesCompany.map(
        (product) => product.productTypeId
      );

      return await db.productsTypes
        .whereIn({ id: productsTypesIds })
        .select("slug", "name", {
          products: (q) =>
            q.products
              .where({ companyId: company.id })
              .select(
                "slug",
                "urlImage",
                "name",
                "cashPrice",
                "priceDose",
                "weight",
                "portion",
                "capsules",
                {
                  flavorsCount: (q) => q.productsFlavors.count(),
                }
              )
              .limit(5),
        });
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  );
