import React from "react";

const ICDCard = ({ code, title, definition, score, entityId }) => {
  const roundedScore = (score * 100).toFixed(2);

  return (
    <div className="w-[250px] md:w-96 bg-white text-black rounded-xl shadow-md p-6 m-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-1"><strong>Code:</strong> {code}</p>
      <p className="text-sm mb-2"><strong>Definition:</strong> {definition}</p>
      <p className="text-sm mb-1"><strong>Entity ID:</strong> {entityId}</p>
      <div className="mt-3">
        <span className="bg-gray-100 text-black font-medium px-3 py-1 rounded-full text-xs shadow-sm">
          Score: {roundedScore}%
        </span>
      </div>
    </div>
  );
};

export default ICDCard;
