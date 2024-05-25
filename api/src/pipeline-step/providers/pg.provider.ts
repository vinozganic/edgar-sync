import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import { Pool } from "pg";
import { config } from "dotenv";

config();

export const db: Kysely<DB> = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.EDGAR_PG_URL,
        }),
    }),
});
