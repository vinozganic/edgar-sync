import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { config } from "dotenv";
import { PG_CONNECTION, PG_SYNC_CONNECTION } from "src/constants";
import { EdgarDB } from "src/types/edgar_db";
import { EdgarSyncDB } from "src/types/edgar_sync_db";

config();

const edgarDbProvider = {
    provide: PG_CONNECTION,
    useValue: new Kysely<EdgarDB>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.EDGAR_PG_URL,
            }),
        }),
    }),
};

const edgarSyncDbProvider = {
    provide: PG_SYNC_CONNECTION,
    useValue: new Kysely<EdgarSyncDB>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.EDGAR_SYNC_PG_URL,
            }),
        }),
    }),
};

export { edgarDbProvider, edgarSyncDbProvider };
