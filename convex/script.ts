import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getJobScript = query({
    args: { id: v.id("script")},
    handler: async (ctx, args) => {
        return await ctx.db.query("script").filter(q =>
            q.eq(q.field("_id"), args.id)
        ).first();
    },
});
