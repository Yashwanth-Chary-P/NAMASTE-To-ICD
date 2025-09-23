import mongoose from "mongoose";

const unaniSchema = new mongoose.Schema(
  {
    "SI.NO": { type: Number, required: true, unique: true },
    NUMC: { type: String, required: true, unique: true }, // e.g., "UM", "A-1"
    TERM: { type: String, required: true }, // main term
    TERM_DIACRITICAL: { type: String },
    short_definition: { type: String },
    long_definition: { type: String },
  },
  {
    timestamps: true,
  }
);

// Text index for search
unaniSchema.index({
  TERM: "text",
  TERM_DIACRITICAL: "text",
  short_definition: "text",
  long_definition: "text",
});

const UnaniCode = mongoose.model("UnaniCode", unaniSchema);

export default UnaniCode;
