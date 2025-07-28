"use client";
import React, { useState, useRef, useEffect } from "react";

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
      setVoices(window.speechSynthesis.getVoices() ?? []);
    };
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      window.speechSynthesis.cancel();
      if ("speechSynthesis" in window)
        window.speechSynthesis.onvoiceschanged = null;
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

    utter.rate = 0.7;
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl px-6 py-10 bg-white/90 border border-gray-200 backdrop-blur-lg animate-fadeIn">

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          aria-label="मागील पृष्ठावर परत जा"
        >
          मागील पृष्ठ
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-800 drop-shadow-sm animate-slideDown">
          {title}
        </h1>
        <div className="mb-6 flex items-center gap-2">
          <input
            type="text"
            lang="mr"
            inputMode="text"
            autoComplete="off"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="मराठीत शोधा किंवा शब्द टाका..."
            className="w-full rounded-lg border border-blue-300 px-4 py-3 bg-white/90 shadow focus:ring-2 focus:ring-blue-200 text-lg font-semibold text-gray-900 transition placeholder-gray-400"
            style={{
              fontFamily:
                "'Noto Sans Devanagari', 'Lohit Marathi', 'Devanagari', Arial, sans-serif",
            }}
          />
          <button
            type="button"
            aria-label={listening ? "माइक सक्रिय आहे..." : "माइकने मराठीत बोला"}
            onClick={startListening}
            className={`flex items-center justify-center rounded-full border-2 border-blue-400 bg-white transition-all duration-150 shadow ${
              listening ? "bg-blue-100 border-blue-600 animate-pulse" : "hover:bg-blue-50"
            }`}
            style={{ width: 48, height: 48 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-7 w-7 ${listening ? "text-blue-600" : "text-blue-400"}`}
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
        <div className="text-xs text-gray-500 mt-[-14px] mb-4 ml-1">
          {listening
            ? "आपण बोलू शकता... (मराठी भाषेसाठी Google/Android ब्राउझर उत्तम)"
            : "शोधण्यासाठी मराठीत टाइप करा किंवा माइक क्लिक करा; माईक चालू करण्यासाठी ब्राउझरला परवानगी द्या."}
        </div>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const idx = questions.indexOf(q);
              const hasAnswer = answers && answers[idx];
              const isVisible = visibleAnswers.has(idx);

              return (
                <div
                  key={idx}
                  tabIndex={0}
                  className="rounded-lg bg-gradient-to-r from-yellow-100 to-blue-50 p-4 shadow text-gray-900 font-medium text-base sm:text-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer">
                    <span className="flex-1" onClick={() => toggleAnswer(idx)}>
                      {q.replace(/^प्रश्न\s*\d+:/, "").trim()}
                    </span>
                    {hasAnswer && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className={`text-blue-700 font-semibold hover:text-blue-900 focus:outline-none group flex items-center gap-1 px-3 py-1 rounded-md border border-blue-600 transition-colors duration-200
                            ${isVisible ? "bg-blue-200" : "bg-blue-50"}
                          `}
                          type="button"
                          aria-expanded={isVisible}
                          aria-controls={`answer-${idx}`}
                        >
                          {isVisible ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 cursor-pointer"
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
                              <span className="cursor-pointer">
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
                              className="rounded-full p-2 border-2 border-red-400 transition duration-150 shadow bg-white hover:bg-red-100 flex items-center justify-center bg-red-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
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
                              className="rounded-full p-2 border-2 border-blue-400 transition duration-150 shadow bg-white hover:bg-blue-50 flex items-center justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-400"
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
                      className="mt-3 border-l-4 border-blue-600 bg-blue-50 p-4 rounded-md text-gray-800 shadow-inner animate-fadeIn"
                      role="region"
                      aria-live="polite"
                    >
                      {answers[idx]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xl text-gray-500 font-semibold">
              कोणताही प्रश्न आढळला नाही.
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(.67,.21,.43,1.55);}
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-25px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-slideDown { animation: slideDown 0.7s cubic-bezier(.67,.21,.43,1.55);}
      `}</style>
    </div>
  );
};

export default QuestionList;
