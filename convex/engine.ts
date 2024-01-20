import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

enum EngineStatus {
  IDLE = 0,
  RUNNING = 1,
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("engine").collect();
  },
});

export const register = mutation({
  args: { mac: v.string(), name: v.string()},
  handler: async (ctx, args) => {
    return await ctx.db.insert("engine", {
      mac: args.mac,
      name: args.name,
      status: EngineStatus.IDLE,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("engine") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});