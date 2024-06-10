# kysely-sql-js

![Powered by TypeScript](https://img.shields.io/badge/powered%20by-typescript-blue.svg)

[Kysely](https://github.com/koskimas/kysely) dialect for [sql.js](https://sql.js.org/#/).

This dialect is just for testing purposes. It's not recommended to use it in production.

## Usage

```ts
import { type GeneratedAlways, Kysely } from "kysely";
import initSqlJs from "sql.js";

import { SqlJsDialect } from "kysely-sql-js";

interface Database {
  person: {
    id: GeneratedAlways<number>;
    first_name: string | null;
    last_name: string | null;
    age: number;
  };
}

const SqlJsStatic = await initSqlJs();

export const db = new Kysely<Database>({
  dialect: new SqlJsDialect({ sqlJs: new SqlJsStatic.Database() }),
});
```

Check detailed example from [tests/getting-started](tests/getting-started).
