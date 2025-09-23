import mongoose from "mongoose";

const ayurvedhaSchema = new mongoose.Schema(
  {
    "Sr No.": { type: Number, required: true, unique: true }, // Your dataset's serial number
    NAMC_ID: { type: Number, required: true, unique: true },
    NAMC_CODE: { type: String, required: true, unique: true },
    NAMC_term: { type: String, required: true },
    NAMC_term_diacritical: { type: String },
    NAMC_term_DEVANAGARI: { type: String },
    Short_definition: { type: String },
    Long_definition: { type: String },
    Ontology_branches: { type: String },
  },
  {
    timestamps: true,
  }
);

// ✅ Text index for searching
ayurvedhaSchema.index({
  Short_definition: "text",
  Long_definition: "text",
  Ontology_branches: "text",
});

const AyurvedhaCode = mongoose.model("AyurvedhaCode", ayurvedhaSchema);

export default AyurvedhaCode;
