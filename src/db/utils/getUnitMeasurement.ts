export const getUnitMeasurement = (unitMeasurementText: string) => {
  const unitsMeasurement = { g: 1, mg: 2, mcg: 3, UI: 4 };

  return unitsMeasurement?.[unitMeasurementText] || null;
};
