import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

enum jobStatus {
    RUNNABLE = 0,
    RUNNING = 1,
    BLOCKING = 2,
    COMPLETED = 3,
    FAILED = 4,
}

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("job").collect();
    },
});

export const getNextJob = query({
    args: { engine_id: v.id("engine")},
    handler: async (ctx, args) => {
        return await ctx.db.query("job").filter(q =>
            q.and(
                q.eq(q.field("engine_id"), args.engine_id),
                q.eq(q.field("status"), jobStatus.RUNNABLE))
        ).order("asc").first();
    },
});
