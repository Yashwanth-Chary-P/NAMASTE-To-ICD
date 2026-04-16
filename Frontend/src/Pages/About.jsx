import React from "react";

export default function AboutPage() {
    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center px-6 md:px-16 py-12">
            {/* Heading */}
            <h1 className="text-3xl md:text-5xl font-bold text-blue-700 mb-6 text-center">
                About Us
            </h1>
            <p className="max-w-3xl text-gray-600 text-center text-lg mb-12">
                Bridging the gap between <span className="font-semibold">Traditional Medicine</span>
                and <span className="font-semibold">Modern Healthcare Standards</span>.
                We are building digital healthcare solutions for Ayurveda, Siddha, Unani, and ICD-11 integration.
            </p>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mb-16">
                <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Mission</h2>
                    <p className="text-gray-600">
                        To make healthcare more <span className="font-semibold">accessible, interoperable,
                            and inclusive</span> by digitizing traditional systems and integrating them into EMR/EHR platforms.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Vision</h2>
                    <p className="text-gray-600">
                        A world where <span className="font-semibold">traditional knowledge
                            and modern medicine</span> work together to deliver holistic, affordable,
                        and globally recognized healthcare.
                    </p>
                </div>
            </div>

            {/* What We Do */}
            <div className="max-w-5xl mb-16">
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                    What We Do
                </h2>
                <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
                    <li className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        ✅ Mapping <span className="font-semibold">NAMASTE Codes</span> to ICD-11
                    </li>
                    <li className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        ✅ Building APIs & integration tools for <span className="font-semibold">EMR/EHR</span>
                    </li>
                    <li className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        ✅ Digitizing & promoting <span className="font-semibold">Ayurveda, Siddha, Unani</span>
                    </li>
                    <li className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        ✅ Creating awareness on <span className="font-semibold">Health & Corporate Insurance</span>
                    </li>
                </ul>
            </div>

            {/* Why It Matters */}
            <div className="max-w-3xl text-center mb-16">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Why It Matters</h2>
                <p className="text-gray-600 text-lg">
                    With the rise of digital health records, it is essential to integrate both traditional
                    and modern systems. This ensures <span className="font-semibold">global recognition,
                        better patient care, and future-ready healthcare innovation</span>.
                </p>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
                {/* <button className="bg-orange-400 hover:bg-orange-500 text-white text-lg font-medium px-6 py-3 rounded-full shadow-md transition">
                    Explore Our Work
                </button> */}
                <button className="mt-2 w-[250px] relative overflow-hidden text-white font-medium rounded-full px-6 py-4 text-[20px] bg-orange-400 transition-all duration-300 ease-in-out 
            before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-white 
            before:rounded-full before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
            before:ease-[cubic-bezier(0.86,0,0.07,1)] hover:before:scale-x-100 hover:before:origin-left hover:text-orange-400">
                    <span className="relative z-10">Explore Our Work</span>
                </button>
            </div>
        </div>
    );
}
