import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { key: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const key = args.key ?? "default";
    const row = await ctx.db
      .query("rosterData")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return row;
  },
});

export const save = mutation({
  args: {
    key: v.optional(v.string()),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    const key = args.key ?? "default";
    const existing = await ctx.db
      .query("rosterData")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("rosterData", {
        key,
        data: args.data,
        updatedAt: Date.now(),
      });
    }
  },
});
