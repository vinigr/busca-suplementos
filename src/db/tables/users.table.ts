import { BaseTable } from "../baseTable";

export class UsersTable extends BaseTable {
  readonly table = "users";
  columns = this.setColumns((t) => ({
    id: t.identity().primaryKey(),
    login: t.varchar(),
    password: t.varchar(),
    status: t.integer().default(1),
    createdAt: t.timestampNoTZ().default(t.sql("now()")),
    updatedAt: t.timestampNoTZ().default("now()"),
  }));
}
