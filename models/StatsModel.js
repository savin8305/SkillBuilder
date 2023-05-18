import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    users: {
      type: Number,
      default: 0,
    },
    subscriptions: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const Stats = mongoose.model("Stats", schema);
