import { env } from "@/env";
import * as schema from "./schema";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const client = neon(env.DATABASE_URL);
export const db = drizzle(client, { schema });
