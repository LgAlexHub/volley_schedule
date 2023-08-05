/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";

import manifest from "./fresh.gen.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

Deno.env.set("ADMIN_UUID", crypto.randomUUID())
Deno.env.set("ADMIN_USER", "admin");
Deno.env.set("ADMIN_PASS", "secret");


await start(manifest, { plugins: [twindPlugin(twindConfig)] });
