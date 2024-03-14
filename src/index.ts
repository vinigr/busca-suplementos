import { Elysia, t } from "elysia";
import { companiesRoutes } from "./db/routes/companies";
import { authRoutes } from "./db/routes/auth";
import { config } from "./db/config";
import bearer from "@elysiajs/bearer";

const app = new Elysia()
  .use(authRoutes)
  .group("/admin", (app) => {
    return app.use(bearer()).guard(
      {
        beforeHandle: async ({ bearer, set, jwt }) => {
          if (!bearer) {
            set.status = 401;
            return { error: "Token não informado ou não é válido" };
          }

          const token = await jwt.verify(bearer as string);

          if (!token || token.aud !== "1") {
            set.status = 401;
            return { error: "Token não informado ou não é válido" };
          }
        },
      },
      (app) => app.use(companiesRoutes)
    );
  })
  .get("/", () => "Hello Elysia")
  .listen(config.port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
