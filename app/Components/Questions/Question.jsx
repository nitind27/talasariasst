"use client";
import { useRouter } from "next/navigation";
import React from "react";
import "./question.css";

const questionOptions = [
  "महसूल विषयक प्रश्न",
  "कुळ कायदा विषयक प्रश्न",
  "वारसा विषयक प्रश्न",
  "न्यायदान विषयक प्रश्न",
];

const Question = () => {
  const router = useRouter();
  
  const handleClick = (idx) => {
    if (idx === 0) router.push("/questionsdata/mahsul");
    if (idx === 1) router.push("/questionsdata/krishi");
    if (idx === 2) router.push("/questionsdata/bharas");
    if (idx === 3) router.push("/questionsdata/nyaydan");
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(idx);
    }
  };

  return (
    <div className="question-container">
      <div className="question-card animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="back-button"
          aria-label="मागील पृष्ठावर परत जा"
        >
          मागील पृष्ठ
        </button>

        <h1 className="page-title animate-slideDown">
          प्रश्नोत्तरे
        </h1>
        
        <div className="options-container">
          {questionOptions.map((option, idx) => (
            <div
              key={idx}
              className="option-item"
              tabIndex={0}
              onClick={() => handleClick(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              role="button"
              aria-pressed="false"
            >
              <span className="option-icon">❓</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
