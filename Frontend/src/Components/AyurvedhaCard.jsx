import React from "react";

const AyurvedhaCard = ({ NAMC_CODE, Short_definition, Long_definition, Ontology_branches }) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="text-lg font-bold text-green-700 mb-2">
        {NAMC_CODE} - {Short_definition}
      </h3>
      <p className="text-sm text-gray-700 mb-2">{Long_definition}</p>
      <p className="text-xs text-gray-500 mb-2">Ontology: {Ontology_branches}</p>
    </div>
  );
};

export default AyurvedhaCard;
