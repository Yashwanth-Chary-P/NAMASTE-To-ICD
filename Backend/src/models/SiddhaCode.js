import mongoose from "mongoose";

const siddhaSchema = new mongoose.Schema(
  {
    NAMC_ID: { type: Number, required: true, unique: true },
    NAMC_CODE: { type: String, required: true, unique: true }, // e.g., "SID", "DIS", "AAA1.1"
    NAMC_TERM: { type: String, required: true }, // Tamil term or category name
    short_definition: { type: String },
    long_definition_with_symptoms: { type: String },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// ✅ Text index for term-based search
siddhaSchema.index({
  short_definition: "text",
  long_definition_with_symptoms: "text",
});

const SiddhaCode = mongoose.model("SiddhaCode", siddhaSchema);

export default SiddhaCode;
