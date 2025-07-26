"use client";
import { useRouter } from "next/navigation";
import React from "react";

const questionOptions = [
  "महसूल विषयक प्रश्न ने",
  "कृषी कायदा विषयक प्रश्न ने",
  "भारास कायदा विषयक प्रश्न ने",
  "न्यायदान विषयक प्रश्न ने",
];

const Question = () => {
  const router = useRouter();
  const handleClick = (idx) => {
    // For example, you might want /questions/mahsul, /questions/krishi, etc.
    if (idx === 0) router.push("/questionsdata/mahsul");
    if (idx === 1) router.push("/questionsdata/krishi");
    if (idx === 2) router.push("/questionsdata/bharas");
    if (idx === 3) router.push("/questionsdata/nyaydan");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md rounded-3xl shadow-2xl px-6 py-10 bg-white/90 border border-gray-200 backdrop-blur-lg animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow-sm animate-slideDown">
          प्रश्नाउत्तरी
        </h1>
        <div className="flex flex-col gap-6">
          {questionOptions.map((option, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-gradient-to-r from-green-100 to-blue-100 p-5 shadow-md text-gray-900 font-semibold text-lg hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
              tabIndex={0}
              onClick={() => handleClick(idx)}
            >
              <span className="inline-block text-2xl text-blue-400">❓</span>
              <span>{option}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform: scale(0.98);}
          to { opacity:1; transform: scale(1);}
        }
        .animate-fadeIn { animation:fadeIn 0.7s cubic-bezier(.67,.21,.43,1.55);}
        @keyframes slideDown {
          from { opacity:0; transform: translateY(-25px);}
          to { opacity:1; transform: translateY(0);}
        }
        .animate-slideDown { animation:slideDown 0.7s cubic-bezier(.67,.21,.43,1.55);}
      `}</style>
    </div>
  );
};

export default Question;
