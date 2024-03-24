import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsSubtypesClientRoutes = new Elysia({
  prefix: "/products-subtypes",
}).get(
  ":slug/products",
  async ({ params: { slug }, set }) => {
    const productSubtype = await db.productsSubtypes
      .findByOptional({ slug })
      .select("id");

    if (!productSubtype) {
      set.status = 404;

      return { error: "Categoria não encontrada" };
    }

    return await db.products
      .where({ productSubtypeId: productSubtype.id })
      .select("slug", "urlImage", "name", "cashPrice", {
        company: (q) => q.companies.select("slug", "name"),
      });
  },
  {
    params: t.Object({
      slug: t.String(),
    }),
  }
);
