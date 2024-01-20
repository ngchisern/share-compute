import { register, deregister } from "./engine.js";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env["CONVEX_URL"]);
const engine_id = await register(client);

process.stdin.resume();

process.on("SIGINT", async () => {
  await deregister(client, engine_id);
  process.exit();
});

// client.query(api.engine.get).then(console.log);
