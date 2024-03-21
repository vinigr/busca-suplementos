import { Elysia, t } from "elysia";
import { db } from "../../db/db";

export const unitsMeasurementsAdminRoutes = new Elysia({
  prefix: "/units-measurements",
}).get("/list", async () => {
  return await db.unitsMeasurements.select("id", "name").order("id");
});
