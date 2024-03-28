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
    async ({
      params: { slug },
      query: { size, page, companies: companiesSlugs },
      set,
    }) => {
      const productType = await db.productsTypes
        .findByOptional({ slug })
        .select("id");

      if (!productType) {
        set.status = 404;

        return { error: "Categoria não encontrada" };
      }

      let companiesIds: number[] = [];

      if (companiesSlugs) {
        const companiesSlugsArray = companiesSlugs?.split(",");

        if (companiesSlugsArray.length) {
          const companies = await db.companies
            .whereIn("slug", companiesSlugsArray)
            .select("id");

          companiesIds = companies.map((company) => company.id);
        }
      }

      let queryProducts = db.products
        .where({ productTypeId: productType.id })
        .select("slug", "urlImage", "name", "cashPrice", {
          company: (q) => q.companies.select("slug", "name"),
        })
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (companiesIds.length) {
        queryProducts = queryProducts.whereIn("companyId", companiesIds);
      }

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
        companies: t.Optional(t.String()),
      }),
    }
  )
  .get(
    ":slug/products/filters",
    async ({ params: { slug }, set }) => {
      const productType = await db.productsTypes
        .findByOptional({ slug })
        .select("id");

      if (!productType) {
        set.status = 404;

        return { error: "Categoria não encontrada" };
      }

      const products = await db.products
        .where({ productTypeId: productType.id })
        .select("cashPrice", "productSubtypeId", "companyId", {
          flavors: (q) => q.productsFlavors.select("flavorId"),
        });

      if (!products.length) {
        return {
          companies: [],
          productSubtypes: [],
          flavors: [],
        };
      }

      const companies = await db.companies
        .select("slug", "name")
        .whereIn(
          "id",
          products.map((product) => product.companyId)
        )
        .order("name");

      const subTypesIds = products
        .filter((product) => product.productSubtypeId)
        .map((product) => product.productSubtypeId!);

      const productSubtypes = subTypesIds.length
        ? await db.productsSubtypes
            .select("slug", "name")
            .whereIn("id", subTypesIds)
            .order("name")
        : [];

      const flavorsIds = products
        .map((product) => {
          return product.flavors.map((productFlavor) => productFlavor.flavorId);
        })
        .flat();

      const flavors = await db.flavors
        .select("id", "name")
        .whereIn("id", flavorsIds)
        .order("name");

      return {
        companies,
        productSubtypes,
        flavors,
      };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  );
