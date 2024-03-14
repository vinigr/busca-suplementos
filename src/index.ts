import { Elysia, t } from "elysia";
import { db } from "./db/db";
import { companiesRoutes } from "./db/routes/companies";

const app = new Elysia()
  .group("/admin", (app) => {
    return app.use(companiesRoutes);
  })
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
