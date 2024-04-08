import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const productsSubtypesClientRoutes = new Elysia({
  prefix: "/products-subtypes",
})
  .get(
    "/:slug",
    async ({ params: { slug }, set }) => {
      const productSubtype = await db.productsSubtypes
        .select("slug", "name")
        .findByOptional({ slug });

      if (!productSubtype) {
        set.status = 404;

        return { error: "Categoria não encontrada" };
      }

      return productSubtype;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  )
  .get(
    ":slug/products",
    async ({
      params: { slug },
      query: {
        size,
        page,
        companies: companiesSlugs,
        flavors: flavorsSlugs,
        forms,
        sort,
      },
      set,
    }) => {
      const productSubtype = await db.productsSubtypes
        .select("id", "slug", "name", {
          productType: (q) => q.productsTypes.select("slug"),
        })
        .findByOptional({ slug });

      if (!productSubtype) {
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

      let flavorsIds: number[] = [];

      if (flavorsSlugs) {
        const flavorsSlugsArray = flavorsSlugs?.split(",");

        if (flavorsSlugsArray.length) {
          const flavors = await db.flavors
            .whereIn("slug", flavorsSlugsArray)
            .select("id");

          flavorsIds = flavors.map((company) => company.id);
        }
      }

      const searchProtein = productSubtype?.productType?.slug === "proteinas";

      let queryProducts = db.products
        .where({ productSubtypeId: productSubtype.id })
        .select(
          "slug",
          "urlImage",
          "name",
          "cashPrice",
          "priceDose",
          "weight",
          "capsules",
          "portion",
          {
            company: (q) => q.companies.select("slug", "name"),
            flavorsCount: (q) => q.productsFlavors.count(),
          }
        )
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (searchProtein) {
        queryProducts = queryProducts.select({
          maxProteinTotal: (q) => q.productsFlavors.max("proteinTotal"),
          minPriceGramProtein: (q) => q.productsFlavors.min("proteinGramPrice"),
        });
      }

      if (companiesIds.length) {
        queryProducts = queryProducts.whereIn("companyId", companiesIds);
      }

      if (flavorsIds.length) {
        queryProducts = queryProducts.join("productsFlavors", (q) =>
          q.whereIn({ flavorId: flavorsIds })
        );
      }

      if (forms) {
        const formArray = (
          forms.split(",")
            ? forms
                .split(",")
                .map((form) => {
                  if (form === "powder") {
                    return 1;
                  }

                  if (form === "capsules") {
                    return 2;
                  }

                  return;
                })
                .filter((form) => {
                  return Number.isInteger(form);
                })
            : []
        ) as number[];

        if (formArray) {
          queryProducts = queryProducts.whereIn("form", formArray);
        }
      }

      let queryProductsWithSort = queryProducts;

      if (sort) {
        if (sort === "price.asc") {
          queryProductsWithSort = queryProductsWithSort.order({
            cashPrice: "ASC",
          });
        }

        if (sort === "price.desc") {
          queryProductsWithSort = queryProductsWithSort.order({
            cashPrice: "DESC",
          });
        }

        if (sort === "priceDose.asc") {
          queryProductsWithSort = queryProductsWithSort.order({
            priceDose: "ASC",
          });
        }

        if (sort === "priceDose.desc") {
          queryProductsWithSort = queryProductsWithSort.order({
            priceDose: "DESC",
          });
        }

        if (sort === "name.desc") {
          queryProductsWithSort = queryProductsWithSort.order({ name: "DESC" });
        }

        if (searchProtein) {
          if (sort === "protein-quantity.asc") {
            queryProductsWithSort = queryProductsWithSort.order({
              maxProteinTotal: "ASC",
            });
          }

          if (sort === "protein-quantity.desc") {
            queryProductsWithSort = queryProductsWithSort.order({
              maxProteinTotal: "DESC",
            });
          }

          if (sort === "protein-price.asc") {
            queryProductsWithSort = queryProductsWithSort.order({
              minPriceGramProtein: "ASC",
            });
          }

          if (sort === "protein-price.desc") {
            queryProductsWithSort = queryProductsWithSort.order({
              minPriceGramProtein: "DESC",
            });
          }
        }
      } else {
        queryProductsWithSort = queryProductsWithSort.order({
          "products.name": "ASC",
        });
      }

      const products = await queryProductsWithSort;

      const resultCountProducts = await db.products
        .where({ productSubtypeId: productSubtype.id })
        .count();

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
        flavors: t.Optional(t.String()),
        forms: t.Optional(t.String()),
        sort: t.Optional(t.String()),
      }),
    }
  )
  .get(
    ":slug/products/filters",
    async ({ params: { slug }, set }) => {
      const productSubtype = await db.productsSubtypes
        .select("id", "slug", "name", {
          productType: (q) => q.productsTypes.select("slug"),
        })
        .findByOptional({ slug });

      if (!productSubtype) {
        set.status = 404;

        return { error: "Categoria não encontrada" };
      }

      const products = await db.products
        .where({ productSubtypeId: productSubtype.id })
        .select("cashPrice", "companyId", {
          flavors: (q) => q.productsFlavors.select("flavorId"),
        });

      if (!products.length) {
        return {
          companies: [],
          flavors: [],
          optionsSort: [],
        };
      }

      const searchProtein = productSubtype?.productType?.slug === "proteinas";

      const companies = await db.companies
        .select("slug", "name")
        .whereIn(
          "id",
          products.map((product) => product.companyId)
        )
        .order("name");

      const flavorsIds = products
        .map((product) => {
          return product.flavors.map((productFlavor) => productFlavor.flavorId);
        })
        .flat();

      const flavors = await db.flavors
        .select("slug", "name")
        .whereIn("id", flavorsIds)
        .order("name");

      const optionsSort = [
        {
          value: "price.asc",
          label: "Menor valor",
        },
        {
          value: "price.desc",
          label: "Maior valor",
        },
        {
          value: "priceDose.asc",
          label: "Menor valor por dose",
        },
        {
          value: "priceDose.desc",
          label: "Maior valor por dose",
        },
        {
          value: "name.asc",
          label: "Alfabético A-Z",
        },
        {
          value: "name.desc",
          label: "Alfabético Z-A",
        },
      ];

      if (searchProtein) {
        optionsSort.push(
          {
            value: "protein-quantity.asc",
            label: "Menor quantidade proteínas",
          },
          {
            value: "protein-quantity.desc",
            label: "Maior quantidade proteínas",
          },
          {
            value: "protein-price.asc",
            label: "Menor valor de proteínas",
          },
          {
            value: "protein-price.desc",
            label: "Maior valor de proteínas",
          }
        );
      }

      return {
        companies,
        flavors,
        optionsSort,
      };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  );
