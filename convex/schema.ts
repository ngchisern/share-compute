import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values";

export default defineSchema({
  engine: defineTable({
    _id: v.id("engine"),
    name: v.string(),
    status: v.any(),
  }),
  workflow: defineTable({
    _id: v.id("workflow"),
    status: v.any(),
  }),
  job: defineTable({
    _id: v.id("job"),
    engine_id: v.id("engine"),
    workflow_id: v.id("workflow"),
    entry_point: v.string(),
    arguments: v.array(v.string()),
    return_type: v.any(),
    script: v.string(),
    status: v.any(),
    output: v.string(),
  }),
  dependency: defineTable({
    job_id: v.id("job"),
    remaining: v.int64(),
    next: v.optional(v.id("job")),
  }),
});
