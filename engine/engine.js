import { api } from "../convex/_generated/api.js";

import getMAC from "getmac";

export const register = async (client) => {
  const args = process.argv.slice(2);

  const mac = getMAC();
  const name = args[0] || mac;
  const result = await client.mutation(api.engine.register, {
    name,
    mac,
  });

  return result;
};

export const deregister = async (client, id) => {
  const args = process.argv.slice(2);

  await client.mutation(api.engine.remove, {
    id,
  });

  return "success";
};
