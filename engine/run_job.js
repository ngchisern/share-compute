import { api } from "../convex/_generated/api.js";
import { PythonShell } from "python-shell";

export const run_job = async (client, job) => {
  let script = await client.query(api.script.getJobScript, {
    id: job.script_id,
  });

  await execute(client, job, script);
  return "done";
};

const execute = async (client, job, script) => {
  const code = await apply_arguments(script);

  await client.mutation(api.job.runJob, {
    id: job._id,
  });

  PythonShell.runString(code, null)
    .then(async (output) => {
      await updateOutput(client, script, output[output.length - 1]);
      await succeed(client, job, output[output.length - 1]);
    })
    .catch(async (error) => {
      await updateOutput(client, script, error["traceback"]);
      await fail(client, job);
    });
};

const apply_arguments = async (script) => {
  const quoted_arguments = script.arguments
    .map((arg) => "'" + arg + "'")
    .join(",");
  const code =
    script.content +
    "\n\n" +
    "print(" +
    script.entry_point +
    "(" +
    quoted_arguments +
    "))";
  return code;
};

const updateOutput = async (client, script, output) => {
  await client.mutation(api.script.updateOutput, {
    id: script._id,
    output,
  });
};

const fail = async (client, job) => {
  await client
    .mutation(api.job.failJob, {
      id: job._id,
    })
    .then(async () => {
      await client.mutation(api.workflow.failWorkflow, {
        id: job.workflow_id,
      });
    });
};

const succeed = async (client, job, output) => {
  await client
    .mutation(api.job.completeJob, {
      id: job._id,
    })
    .then(async () => {
      const next = job.next;
      if (!next) {
        await client.mutation(api.workflow.completeWorkflow, {
          id: job.workflow_id,
        });
        return;
      }

      await client
        .query(api.job.getJob, {
          id: next,
        })
        .then(async (job) => {
          let args = job.arguments;
          args.push(output);

          await client.mutation(api.job.reduceDependency, {
            id: next,
          });
        });
    });
};
