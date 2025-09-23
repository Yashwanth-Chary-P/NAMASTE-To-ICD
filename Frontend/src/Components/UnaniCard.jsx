import React from "react";

export default function UnaniCard({ code, title, definition }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-700 mb-1">
                <span className="font-semibold">Code:</span> {code}
            </p>
            <p className="text-gray-700">{definition}</p>
        </div>
    );
}
