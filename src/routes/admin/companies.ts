import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { generateRandomString } from "../../helpers/generateRandomString";
import sharp from "sharp";

export const companiesAdminRoutes = new Elysia({ prefix: "/companies" })
  .get(
    "/",
    async ({ query: { page, size, search } }) => {
      let query = db.companies
        .select("id", "name", "active")
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size));

      if (search) {
        query = query.where({ name: { contains: String(search) } });
      }

      const categories = await query;

      let countCategories = db.companies.count();

      if (search) {
        countCategories = countCategories.where({
          name: { contains: String(search) },
        });
      }

      const resultCountCategories = await countCategories;

      const pageCount = Math.ceil(resultCountCategories / Number(size));

      return {
        data: categories,
        total: resultCountCategories,
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
      return await db.companies.insert({
        name: body.name.trim(),
        slug: body.name
          .trim()
          .replaceAll(" ", "-")
          .toLowerCase()
          .normalize("NFD")
          .replaceAll(/\p{Diacritic}/gu, ""),
      });
    },
    {
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      return await db.companies.where({ id }).update({
        name: body.name.trim(),
        slug: body.name
          .trim()
          .replaceAll(" ", "-")
          .toLowerCase()
          .normalize("NFD")
          .replaceAll(/\p{Diacritic}/gu, ""),
        active: body.active,
      });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.String({ error: "O nome é obrigatório" }),
        active: t.Boolean(),
      }),
    }
  )
  .post(
    "/:id/upload",
    async ({ body, params: { id } }) => {
      const nameFile = `${generateRandomString(12)}.png`;

      const image = await sharp(await body.image.arrayBuffer())
        .toFormat("png", { quality: 80 })
        .resize(150, 150, {
          fit: "inside",
        })
        .toBuffer();

      await Bun.write(`./public/companies/${nameFile}`, image);

      return await db.companies.where({ id }).update({ urlImage: nameFile });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        image: t.File(),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await db.companies
        .findByOptional({ id })
        .select("id", "name", "active", "urlImage");
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get("/list", async () => {
    return await db.companies.select("id", "name").order("name");
  });
