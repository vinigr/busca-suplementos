import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsAdminRoutes = new Elysia({ prefix: "/products" })
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.products
        .select("id", "name", {
          productType: (q) => q.productsTypes.select("id", "name"),
        })
        // .with("productType", db.productsTypes.select("id", "name"))
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const products = await query;

      let countProducts = db.products.count();

      if (search) {
        countProducts = countProducts.where({
          name: { contains: String(search) },
        });
      }

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
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const productId = await db.products.insert({
        name: body.name,
        companyId: body.companyId,
        productTypeId: body.productTypeId,
        productSubtypeId: body.productSubtypeId,
        form: body.form,
        portion: body.portion,
        weight: body.weight,
        capsules: body.capsules,
        link: body.link,
        stampId: body.stampId,
      });

      return { productId };
    },
    {
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        companyId: t.Numeric({ error: "A empresa é obrigatória" }),
        productTypeId: t.Numeric({ error: "O tipo do produto é obrigatório" }),
        productSubtypeId: t.Nullable(t.Optional(t.Numeric())),
        form: t.Numeric({ error: "A forma é obrigatória" }),
        portion: t.Nullable(t.Optional(t.Numeric())),
        weight: t.Nullable(t.Optional(t.Numeric())),
        capsules: t.Nullable(t.Optional(t.Numeric())),
        link: t.Nullable(t.Optional(t.String())),
        stampId: t.Nullable(t.Optional(t.Numeric())),
      }),
    }
  );
