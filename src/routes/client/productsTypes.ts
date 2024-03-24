import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsTypesClientRoutes = new Elysia({
  prefix: "/products-types",
})
  .get("/", async () => {
    return await db.productsTypes
      .select("slug", "name", {
        subtypes: (q) => q.productsSubtypes.select("slug", "name"),
      })
      .order("name");
  })
  .get(
    ":slug/products",
    async ({ params: { slug }, query: { size, page }, set }) => {
      const productType = await db.productsTypes
        .findByOptional({ slug })
        .select("id");

      if (!productType) {
        set.status = 404;

        return { error: "Categoria não encontrada" };
      }

      let queryProducts = db.products
        .where({ productTypeId: productType.id })
        .select("slug", "urlImage", "name", "cashPrice", {
          company: (q) => q.companies.select("slug", "name"),
        })
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      const products = await queryProducts;

      let countProducts = queryProducts.count();

      const resultCountProducts = await countProducts;

      const pageCount = Math.ceil(resultCountProducts / Number(size));

      return {
        data: products,
        total: resultCountProducts,
        page,
        pageCount,
      };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 20 }),
      }),
    }
  );
