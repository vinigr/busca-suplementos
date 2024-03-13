import { createBaseTable } from 'orchid-orm';
import { valibotSchemaConfig } from 'orchid-orm-valibot';

export const BaseTable = createBaseTable({
  // Set `snakeCase` to `true` if columns in your database are in snake_case.
  // snakeCase: true,

  schemaConfig: valibotSchemaConfig,

  // Customize column types for all tables.
  columnTypes: (t) => ({
    ...t,
    // Set min and max validations for all text columns,
    // it is only checked when validating with valibot schemas derived from the table.
    text: (min = 0, max = Infinity) => t.text(min, max),
  }),
});
