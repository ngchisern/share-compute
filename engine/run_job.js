import { api } from "../convex/_generated/api.js";

export const run_job = async (client, job) => {
  let script = await client.query(api.script.getJobScript, {
    id: job.script_id,
  });

  await execute(script);

  await client.mutation(api.job.run, {
    id,
  });

  return "success";
};

const execute = async (script) => {};
