import { register, deregister } from "./engine.js";

import { ConvexHttpClient, ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const httpClient = new ConvexHttpClient(process.env["CONVEX_URL"]);
const client = new ConvexClient(process.env["CONVEX_URL"]);

// const engine_id = await register(httpClient);
const engine_id = "jd70ke72qy2dr1217sav93cknd6hwsa1";
process.on("SIGINT", async () => {
  //   await deregister(httpClient, engine_id);
  process.exit();
});

const subscribe = client.onUpdate(api.job.getNextJob, { engine_id }, (job) => {
  let script_id = job.script_id;

  console.log("hi" + job.workflow_id);
});

// client.query(api.engine.get).then(console.log);
