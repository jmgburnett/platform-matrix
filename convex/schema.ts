import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orgData: defineTable({
    key: v.string(), // "default" — single-row pattern
    data: v.string(), // JSON-stringified org state
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
