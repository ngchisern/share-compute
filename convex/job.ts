import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

enum jobStatus {
    RUNNABLE = 0,
    RUNNING = 1,
    BLOCKING = 2,
    COMPLETED = 3,
    FAILED = 4,
}

export const createJob = mutation({
    args: { script_id: v.id("script"), engine_id: v.id("engine"), workflow_id: v.id("workflow") },
    handler: async (ctx, args) => {
        const jobId = await ctx.db.insert("job", {
            status: jobStatus.RUNNABLE, // actually pending next job info, 
            script_id: args.script_id,
            engine_id: args.engine_id,
            workflow_id: args.workflow_id,
            remaining: 0,   // increment later as we add links
        });
        return jobId;
    },
})

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("job").collect();
    },
});

export const getJob = query({
    args: { id: v.id("job") },
    handler: async (ctx, args) => {
        return await ctx.db.query("job").filter(q =>
            q.eq(q.field("_id"), args.id)
        ).first();
    },
});

export const getNextJob = query({
    args: { engine_id: v.id("engine") },
    handler: async (ctx, args) => {
        return await ctx.db.query("job").filter(q =>
            q.and(
                q.eq(q.field("engine_id"), args.engine_id),
                q.eq(q.field("status"), jobStatus.RUNNABLE))
        ).order("asc").first();
    },
});

export const runJob = mutation({
    args: { id: v.id("job") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: jobStatus.RUNNING });
    },
});

export const failJob = mutation({
    args: { id: v.id("job") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: jobStatus.FAILED });
    },
});

export const completeJob = mutation({
    args: { id: v.id("job") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: jobStatus.COMPLETED });
    },
});

export const reduceDependency = mutation({
    args: { id: v.id("job"), remaining: v.number() },
    handler: async (ctx, args) => {
        if (args.remaining < 0) {
            throw new Error("Remaining cannot be negative");
        }

        const remaining = args.remaining - 1;
        if (remaining === 0) {
            await ctx.db.patch(args.id, { remaining: args.remaining, status: jobStatus.RUNNABLE });
        } else {
            await ctx.db.patch(args.id, { remaining: args.remaining });
        }
    },
});
