import mongoose from "mongoose";

const namasteSchema = new mongoose.Schema(
  {
    category: { type: String }, // e.g. "A"
    NAMC_CODE: { type: String, required: true, unique: true },
    NAMC_TERM: { type: String },
    NAMC_term_diacritical: { type: String },
    NAMC_term_DEVANAGARI: { type: String },
    short_definition: { type: String },
    long_definition_with_symptoms: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ✅ Text index for efficient search
namasteSchema.index({
  NAMC_TERM: "text",
  NAMC_term_diacritical: "text",
  NAMC_term_DEVANAGARI: "text",
  short_definition: "text",
  long_definition_with_symptoms: "text",
});

const NamasteCode = mongoose.model("NamasteCode", namasteSchema);

export default NamasteCode;
