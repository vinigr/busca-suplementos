import { Elysia } from "elysia";
import { companiesAdminRoutes } from "./routes/admin/companies";
import { authAdminRoutes } from "./routes/admin/auth";
import { config } from "./config";
import { bearer } from "@elysiajs/bearer";
import { flavorsAdminRoutes } from "./routes/admin/flavors";
import { cors } from "@elysiajs/cors";
import { productsTypesAdminRoutes } from "./routes/admin/productsTypes";
import { stampsAdminRoutes } from "./routes/admin/stamps";
import { productsSubtypesAdminRoutes } from "./routes/admin/productsSubtypes";
import { productsAdminRoutes } from "./routes/admin/products";
import { productsNutritionalInformationsGroupsRoutes } from "./routes/admin/productsNutritionalInformationsGroups";
import { nutritionalInformationsRoutes } from "./routes/admin/nutritionalInformations";
import { productsNutritionalInformationsRoutes } from "./routes/admin/productsNutritionalInformations";
import { productsFlavorsRoutes } from "./routes/admin/productsFlavors";
import { ingredientsRoutes } from "./routes/admin/ingredients";
import { ingredientsProductsFlavors } from "./routes/admin/ingredientsProductsFlavors";
import { unitsMeasurementsAdminRoutes } from "./routes/admin/unitsMeasurements";
import { productsTypesClientRoutes } from "./routes/client/productsTypes";
import { productsSubtypesClientRoutes } from "./routes/client/productsSubtypes";
import staticPlugin from "@elysiajs/static";
import { productsClientRoutes } from "./routes/client/products";
import { companiesClientRoutes } from "./routes/client/companies";

const app = new Elysia()
  .use(cors({ methods: "*" }))
  .use(staticPlugin())
  .use(authAdminRoutes)
  .group("/admin", (app) => {
    return app.use(bearer()).guard(
      {
        beforeHandle: async ({ bearer, set, jwt }) => {
          if (!bearer) {
            set.status = 401;
            return { error: "Token não informado ou não é válido" };
          }

          const token = await jwt.verify(bearer as string);

          if (!token) {
            set.status = 401;
            return { error: "Token não informado ou não é válido" };
          }
        },
      },
      (app) =>
        app
          .use(companiesAdminRoutes)
          .use(flavorsAdminRoutes)
          .use(productsTypesAdminRoutes)
          .use(stampsAdminRoutes)
          .use(productsSubtypesAdminRoutes)
          .use(productsAdminRoutes)
          .use(productsNutritionalInformationsGroupsRoutes)
          .use(nutritionalInformationsRoutes)
          .use(productsNutritionalInformationsRoutes)
          .use(productsFlavorsRoutes)
          .use(ingredientsRoutes)
          .use(ingredientsProductsFlavors)
          .use(unitsMeasurementsAdminRoutes)
          .onError(({ error }) => {
            console.log(error);

            return { message: error.message };
          })
    );
  })
  .group("", (app) => {
    return app
      .use(companiesClientRoutes)
      .use(productsTypesClientRoutes)
      .use(productsSubtypesClientRoutes)
      .use(productsClientRoutes);
  })
  .get("/", () => "Hello Elysia")
  .listen(config.port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
