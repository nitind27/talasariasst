"use client";
import React, { useState, useRef, useEffect } from "react";
import "./QuestionList.css";
const normalize = (str) => str.normalize("NFC").replace(/\s+/g, "").toLowerCase();

const QuestionList = ({ questions, answers = {}, title = "प्रश्नावली" }) => {
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [visibleAnswers, setVisibleAnswers] = useState(new Set());
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const utterRef = useRef(null);

  const filteredQuestions = !search
    ? questions
    : questions.filter((q) => normalize(q).includes(normalize(search)));

  // Mic for search
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "mr-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      if (event.results.length) {
        setSearch(event.results[0][0].transcript);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  // Speech Synthesis management with STOP support
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis?.getVoices?.() ?? []);
    };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Play answer as Marathi TTS
  const speakAnswer = (idx, answer) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(answer);
    utterRef.current = utter;

    // Log all available voices for debugging
    console.log(
      "Available voices:",
      voices.map((v) => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI,
        gender: v.gender,
      }))
    );

    const preferredVoiceNames = [
      "Google मराठी",
      "Google हिन्दी",
      "Google Hindi (India)",
      "Google हिंदी (भारत)",
      "Google female",
      "Microsoft Heera Desktop - Hindi (India)",
      "Microsoft Kalpana Desktop - Hindi (India)",
    ];

    let selectedVoice = voices.find(
      (v) =>
        (v.lang && (v.lang === "mr-IN" || v.lang.startsWith("mr"))) &&
        preferredVoiceNames.some((name) => v.name === name)
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          (v.lang && (v.lang === "mr-IN" || v.lang.startsWith("mr"))) &&
          ((v.gender && v.gender.toLowerCase() === "female") ||
            /female|woman|स्त्री|महिला|महिलां/i.test(v.name))
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang === "mr-IN" || (v.lang && v.lang.startsWith("mr"))
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          (v.lang && (v.lang === "hi-IN" || v.lang.startsWith("hi"))) &&
          (preferredVoiceNames.some((name) => v.name === name) ||
            (v.gender && v.gender.toLowerCase() === "female") ||
            /female|woman|स्त्री|महिला|mahila/i.test(v.name))
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang === "hi-IN" || (v.lang && v.lang.startsWith("hi"))
      );
    }

    if (!selectedVoice && voices.length) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utter.voice = selectedVoice;
      utter.lang = selectedVoice.lang;
    }

    utter.rate = 1;
    utter.pitch = 1.01;
    setSpeakingIdx(idx);

    utter.onend = () => setSpeakingIdx(null);
    utter.onerror = () => setSpeakingIdx(null);

    window.speechSynthesis.speak(utter);
  };

  // STOP speech
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIdx(null);
  };

  // Hide answer: always stop any TTS if speaking
  const toggleAnswer = (idx) => {
    setVisibleAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        if (speakingIdx === idx) stopSpeaking();
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  // If navigating / changing filter, stop any speech
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line
  }, [search]);

  return (
    <div className="question-list-container">
      <div className="question-list-card">

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="back-button"
          aria-label="मागील पृष्ठावर परत जा"
        >
          मागील पृष्ठ
        </button>

        <h1 className="question-list-title">
          {title}
        </h1>
        <div className="search-container">
          <input
            type="text"
            lang="mr"
            inputMode="text"
            autoComplete="off"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="मराठीत शोधा किंवा शब्द टाका..."
            className="search-input"
          />
          <button
            type="button"
            aria-label={listening ? "माइक सक्रिय आहे..." : "माइकने मराठीत बोला"}
            onClick={startListening}
            className={`mic-button ${listening ? "listening" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={listening ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v2m0 0h-4m4 0h4m-4-2a6 6 0 006-6V7a6 6 0 10-12 0v5a6 6 0 006 6z"
              />
            </svg>
          </button>
        </div>
        <div className="search-help">
          शोधण्यासाठी मराठीत टाइप करा किंवा माइक क्लिक करा
          {/* {listening
            ? "आपण बोलू शकता... (मराठी भाषेसाठी Google/Android ब्राउझर उत्तम)"
            : "शोधण्यासाठी मराठीत टाइप करा किंवा माइक क्लिक करा; माईक चालू करण्यासाठी ब्राउझरला परवानगी द्या."} */}
        </div>
        <div className="questions-container">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const idx = questions.indexOf(q);
              const hasAnswer = answers && answers[idx];
              const isVisible = visibleAnswers.has(idx);

              return (
                <div
                  key={idx}
                  tabIndex={0}
                  className="question-item"
                >
                  <div className="question-content">
                    <span className="question-text" onClick={() => toggleAnswer(idx)}>
                      {q.replace(/^प्रश्न\s*\d+:/, "").trim()}
                    </span>
                    {hasAnswer && (
                      <div className="audio-controls">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className={`answer-button ${isVisible ? "visible" : ""}`}
                          type="button"
                          aria-expanded={isVisible}
                          aria-controls={`answer-${idx}`}
                        >
                          {isVisible ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>{" "}
                            </>
                          ) : (
                            <>
                              <span>
                                उत्तर
                              </span>
                            </>
                          )}
                        </button>
                        {isVisible &&
                          (speakingIdx === idx ? (
                            <button
                              onClick={stopSpeaking}
                              type="button"
                              aria-label="बोलणे थांबवा"
                              className="audio-button stop"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => speakAnswer(idx, answers[idx])}
                              type="button"
                              aria-label="उत्तर ऐका"
                              className="audio-button"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 3a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1Zm6.07 3.93a1 1 0 0 1 1.41 0a9 9 0 0 1 0 12.73a1 1 0 1 1-1.41-1.41a7 7 0 0 0 0-9.91a1 1 0 0 1 0-1.41ZM18 12a1 1 0 0 1 2 0a10 10 0 0 1-3.29 7.5a1 1 0 1 1-1.41-1.41A8 8 0 0 0 18 12ZM6.93 5.93a1 1 0 0 1 0 1.41a7 7 0 0 0 0 9.91a1 1 0 1 1-1.41 1.41a9 9 0 0 1 0-12.73a1 1 0 0 1 1.41 0ZM6 12a1 1 0 0 1 2 0a8 8 0 0 0 2 5.5a1 1 0 1 1-1.41 1.41A10 10 0 0 1 6 12Zm6 7a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z" />
                              </svg>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  {isVisible && hasAnswer && (
                    <div
                      id={`answer-${idx}`}
                      className="answer-display"
                    >
                      {answers[idx]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-results">
              कोणताही प्रश्न आढळला नाही.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
