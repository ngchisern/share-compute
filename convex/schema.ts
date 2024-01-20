import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values";

export default defineSchema({
  engine: defineTable({
    _id: v.id("engine"),
    mac: v.string(),
    name: v.string(),
    status: v.number(),
  }),
  workflow: defineTable({
    _id: v.id("workflow"),
    status: v.number(),
  }),
  script: defineTable({
    _id: v.id("job"),
    entry_point: v.string(),
    arguments: v.array(v.any()),
    content: v.string(),
    output: v.optional(v.string()),
  }),
  job: defineTable({
    _id: v.id("job"),
    status: v.number(),
    script_id: v.id("script"),
    engine_id: v.id("engine"),
    workflow_id: v.id("workflow"),
    remaining: v.number (),
    next: v.optional(v.id("job")),
  }),
});
