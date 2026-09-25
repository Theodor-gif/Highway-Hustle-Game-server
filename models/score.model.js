import { Schema, model } from "mongoose";

const scoreSchema = new Schema(
  {
    score: { type: Number, required: true },
    player: { type: Schema.Types.ObjectId, ref: "Users" },
    firstname: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default model("Scores", scoreSchema);
