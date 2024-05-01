import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import { Pool } from "pg";
import { config } from "dotenv";
import { PG_CONNECTION } from "src/constants";

config();

const sqlProvider = {
    provide: PG_CONNECTION,
    useValue: new Kysely<DB>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.PG_URL,
            }),
        }),
    }),
};

export default sqlProvider;
