import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Find Row",
  key: "postgresql-find-row",
  description: "Finds a row in a table via a lookup column. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.3",
  type: "action",
  props: {
    postgresql,
    table: {
      propDefinition: [
        postgresql,
        "table",
      ],
    },
    column: {
      propDefinition: [
        postgresql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      label: "Lookup Column",
      description: "Find row by searching for a value in this column. Returns first row found",
    },
    value: {
      propDefinition: [
        postgresql,
        "value",
        (c) => ({
          table: c.table,
          column: c.column,
        }),
      ],
    },
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      column,
      value,
      rejectUnauthorized,
    } = this;
    try {
      const res = await this.postgresql.findRowByValue(table, column, value, rejectUnauthorized);
      const summary = res
        ? "Row found"
        : "Row not found";
      $.export("$summary", summary);
      return res;
    } catch (error) {
      throw new Error(`
      Row not retrieved due to an error. ${error}.
      This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
    `);
    }
  },
};
