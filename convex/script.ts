import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createScript = mutation({
    args: { entry_point: v.string(), arguments: v.array(v.any()), content: v.string() },
    handler: async (ctx, args) => {
        const scriptId = await ctx.db.insert("script",
            { entry_point: args.entry_point, arguments: args.arguments, content: args.content }
        );
        return scriptId;
    },
})

export const getJobScript = query({
    args: { id: v.id("script") },
    handler: async (ctx, args) => {
        return await ctx.db.query("script").filter(q =>
            q.eq(q.field("_id"), args.id)
        ).first();
    },
});

export const updateOutput = mutation({
    args: { id: v.id("script"), output: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { output: args.output });
    },
});

export const getOutput = query({
    args: { id: v.any() },  // don't crash even if invalid id
    handler: async (ctx, args) => {
        const script = await ctx.db.query("script").filter(q =>
            q.eq(q.field("_id"), args.id)
        ).first();
        if (script === null) {
            return null;
        }
        return script.output;
    },
});
