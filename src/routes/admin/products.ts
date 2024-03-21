import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { generateRandomString } from "../../helpers/generateRandomString";
import sharp from "sharp";

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
      const { id } = await db.products.create({
        name: body.name,
        companyId: body.companyId,
        productTypeId: body.productTypeId,
        productSubtypeId: body.productSubtypeId,
        form: body.form,
        portion: body.portion,
        weight: body.weight,
        capsules: body.capsules,
        link: body.link || null,
        stampId: body.stampId,
      });

      return { productId: id };
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
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.products.where({ id }).update({
        name: body.name,
        companyId: body.companyId,
        productTypeId: body.productTypeId,
        productSubtypeId: body.productSubtypeId,
        form: body.form,
        portion: body.portion,
        weight: body.weight,
        capsules: body.capsules,
        link: body.link || null,
        stampId: body.stampId,
      });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
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
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.products
        .findByOptional({ id })
        .select(
          "id",
          "name",
          "companyId",
          "productTypeId",
          "productSubtypeId",
          "stampId",
          "form",
          "weight",
          "portion",
          "capsules",
          "link"
        );
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/:id/products-nutritional-informations-groups",
    async ({ params: { id }, query: { page, size, search } }) => {
      let query = db.productsNutritionalInformationsGroups
        .select("id", "name")
        .where({ productId: id })
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const productsNutritionalInformationsGroups = await query;

      let countProductsNutritionalInformationsGroups =
        db.productsNutritionalInformationsGroups.count();

      if (search) {
        countProductsNutritionalInformationsGroups =
          countProductsNutritionalInformationsGroups.where({
            name: { contains: String(search) },
          });
      }

      const resultProductsNutritionalInformationsGroups =
        await countProductsNutritionalInformationsGroups;

      const pageCount = Math.ceil(
        resultProductsNutritionalInformationsGroups / Number(size)
      );

      return {
        data: productsNutritionalInformationsGroups,
        total: resultProductsNutritionalInformationsGroups,
        page,
        pageCount,
      };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id/products-nutritional-informations-groups/list",
    async ({ params: { id }, query: { page, size, search } }) => {
      return await db.productsNutritionalInformationsGroups
        .select("id", "name")
        .where({ productId: id });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id/flavors",
    async ({ params: { id }, query: { page, size, search } }) => {
      let query = db.productsFlavors
        .select("id", {
          flavor: (q) => q.flavor.select("id", "name"),
        })
        .where({ productId: id })
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ "flavor.name": { contains: String(search) } });
      }

      const productsFlavors = await query;

      let countProductsFlavors = db.productsFlavors.count();

      if (search) {
        countProductsFlavors = countProductsFlavors.join("flavor").where({
          "flavor.name": { contains: String(search) },
        });
      }

      const resultProductsFlavors = await countProductsFlavors.count();

      const pageCount = Math.ceil(resultProductsFlavors / Number(size));

      return {
        data: productsFlavors,
        total: resultProductsFlavors,
        page,
        pageCount,
      };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      query: t.Object({
        page: t.Numeric({ default: 1 }),
        size: t.Numeric({ default: 1 }),
        search: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/:id/upload",
    async ({ body, params: { id } }) => {
      const nameFile = `${generateRandomString(12)}.jpg`;

      const image = await sharp(await body.image.arrayBuffer())
        .toFormat("jpg", { quality: 80 })
        .toBuffer();

      await Bun.write(`./public/products/${nameFile}`, image);

      return await db.products.where({ id }).update({ urlImage: nameFile });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        image: t.File(),
      }),
    }
  );
