import { register, deregister } from "./engine.js";
import { run_job } from "./run_job.js";

import { ConvexHttpClient, ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const httpClient = new ConvexHttpClient(process.env["CONVEX_URL"]);
const client = new ConvexClient(process.env["CONVEX_URL"]);

// const engine_id = await register(httpClient);
const engine_id = "jd70ke72qy2dr1217sav93cknd6hwsa1";

let running = false;
const unsubscribe = client.onUpdate(
  api.job.getNextJob,
  { engine_id },
  async (job) => {
    if (job == null) {
      return;
    }
    while (running) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    running = true;
    await run_job(client, job);
    running = false;
  }
);

process.on("SIGINT", async () => {
  //   await deregister(httpClient, engine_id);
  unsubscribe();
  process.exit();
});
