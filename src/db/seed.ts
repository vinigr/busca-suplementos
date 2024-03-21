import { db } from "./db";

export const seed = async () => {
  await db.unitsMeasurements.insertMany([
    { id: 1, name: "g" },
    { id: 2, name: "mg" },
    { id: 3, name: "mcg" },
    { id: 4, name: "UI" },
  ]);

  await db.$close();
};
