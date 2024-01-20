import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

enum workflowStatus {
    IDLE = 0,
    RUNNING = 1,
    COMPLETED = 2,
    FAILED = 3,
}

export const failWorkflow = mutation({
    args: { id: v.id("workflow") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: workflowStatus.FAILED });
    },
});

export const completeWorkflow = mutation({
    args: { id: v.id("workflow") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: workflowStatus.COMPLETED });
    },
});