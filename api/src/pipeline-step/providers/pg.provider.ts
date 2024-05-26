import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { config } from "dotenv";
import { EdgarDB } from "src/types/edgar_db";
import { EdgarSyncDB } from "src/types/edgar_sync_db";

config();

export const edgarDb: Kysely<EdgarDB> = new Kysely<EdgarDB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.EDGAR_PG_URL,
        }),
    }),
});

export const edgarSyncDb: Kysely<EdgarSyncDB> = new Kysely<EdgarSyncDB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.EDGAR_SYNC_PG_URL,
        }),
    }),
});
