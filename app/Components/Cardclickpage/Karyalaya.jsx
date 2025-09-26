'use client'
import React, { useState, useRef, useEffect } from 'react';
import './karyalaya.css';

const Karyalaya = () => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const [voicesReady, setVoicesReady] = useState(false);

  const speechRef = useRef(null);
  const queueRef = useRef([]);
  const indexRef = useRef(0);

  // Marathi digit to word map
  const digitMap = {
    '0': 'शून्य',
    '1': 'एक',
    '2': 'दोन',
    '3': 'तीन',
    '4': 'चार',
    '5': 'पाच',
    '6': 'सहा',
    '7': 'सात',
    '8': 'आठ',
    '9': 'नऊ'
  };

  const convertDigitsToMarathiWords = (text) => {
    return text.replace(/\d/g, (digit) => digitMap[digit] || digit);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const handleVoicesChanged = () => {
      const list = window.speechSynthesis?.getVoices?.() ?? [];
      setVoices(list);
      if (list.length) setVoicesReady(true);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const ensureVoicesReady = async (timeoutMs = 2000) => {
    if (!('speechSynthesis' in window)) return false;
    if (voicesReady && voices.length) return true;

    const start = Date.now();
    return new Promise((resolve) => {
      const tick = () => {
        const list = window.speechSynthesis.getVoices() ?? [];
        if (list.length) {
          setVoices(list);
          setVoicesReady(true);
          resolve(true);
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(tick, 100);
      };
      tick();
    });
  };

  const marathiContent = `
तलासरी तालुका पालघर जिल्हयातील 8 तालुक्यांपैकी बहुतांशी (90.73) टक्के आदिवासी बहुल तालुका आहे. तालुका केंद्र शासीत प्रदेश दादरा नगर हवेली व गुजरात राज्य यांच्या सिमा भागेवर वसलेला आहे. तालुक्याच्या मध्य भागातुन मुंबई – अहमदाबाद राष्ट्रीय महामार्ग क्रमांक-8 जात आहे. तालुक्याचे 2011 च्या जनगणनेनुसार एकुण 154818 लोकसंख्या आहे. त्यापैकी 76417 पुरुष व 78401 स्त्रियांचे प्रमाण आहे. तालुक्यात झरी,तलासरी अशी दोन महसुल मंडळे असुन, एकुण 13 तलाठी सजा आहेत.
तालुक्याचे भौगोलीक क्षेत्रफळ 26711 हेक्टर आहे. तालुक्यात तालुका मुख्यालयी तलासरी नगरपंचायत कार्यरत असुन 21 ग्रामपंचायती व 41 महसुल गावे व 214 पाडे आहेत. तसेच जिल्हा ‍परिषदेचे एकुण 5 गट व पंचायत समितीचे 10 गण आहेत.
तालुक्यात वारली, धोडीया,कोकणा, कातकरी, जमाती प्रामुख्याने आढळुन येते यामध्ये वारली समाजीची लोकसंख्या सर्वात जास्त आहे. या तलासरी तालुक्यामध्ये धोडीया,वारली, कोकणी भाषा बोलली जाते. तालुक्यातील मुख्य व्यवसाय शेती असुन, प्रामुख्याने भात हे मुख्य पीक असून हे पीक पावसावर अवलंबुन आहे. तलासरी तालुक्याच्या ठिकाणी शासकीय कार्यालय सेवाभावी संस्था शैक्षणिक संस्था,बँक,पोस्ट, पोलीस स्टेशन, इत्यादी सोयी सुवीधा आहेत.
तलासरी तालुक्यातील झाई समुद्र किनारा, करंजगाव येथील कुंड, कुर्झे येथील धरण (दापचरी डॅम) प्रसिद्ध आहेत.

सांस्कृतिक वारसा
तालुक्यात वारली, धोडीया,कोकणा, कातकरी, जमाती प्रामुख्याने आढळुन येते यामध्ये वारली समाजीची लोकसंख्या सर्वात जास्त आहे. या तलासरी तालुक्यामध्ये धोडीया,वारली, कोकणी भाषा बोलली जाते. यामध्ये उपलाट गटामध्ये डावर,वारली झाई गटामध्ये कोकणी, धोडीया,भाषा प्रामुख्याने बोलली जाते. वारली कलाचित्र हे तालूक्यात लोकप्रिय व प्रचलित आहे. तालुक्यातील मुख्य व्यवसाय शेती आहे. पर्यटन नकाशावर तलासरी तालुक्यातील झाई समुद्र किनारा, करंजगाव येथील कुंड, कुर्झे येथील धरण(दापचरी डॅम) प्रसिद्ध आहेत.

मतदार संघ
पालघर 22-लोकसभा मतदार संघ हा महाराष्ट्र राज्यातील 48 मतदारसंघापैकी एक आहे. हा मतदारसंघ अनुसुचित जमातीसाठी राखीव आहे.
मतदार संघ
पालघर जिल्हयातील 6 विधानसभा मतदार संघापैकी 128 डहाणु विधानसभा (अ.ज.) मतदार संघ एक आहे. त्यामध्ये डहाणु व तलासरी मिळुन एक मतदार संघ आहे.

भौगोलिक माहीती-
भौगोलीक क्षेत्रफळ- 267.18 चौ.किमी.
हवामान-गरम आणि दमट
लोकसंख्या-154818
लगतचे तालुके-डहाणु, वापी,उमंरगांव,सिल्वासा, इत्यादी
तलासरी तालुक्यास झाई हा हे सुंदर गाव वसलेले आहे व त्यागावास समुद्र किनारा लाभलेला आहे.
तलासरी मुख्यालयापासुन मुंबईचे अंतर सूमारे 180 किमी आहे.
`.trim();

  const selectBestVoice = (allVoices) => {
    const preferredVoiceNames = [
      'Google मराठी',
      'Google हिन्दी',
      'Google Hindi (India)',
      'Google हिंदी (भारत)',
      'Google female',
      'Microsoft Heera Desktop - Hindi (India)',
      'Microsoft Kalpana Desktop - Hindi (India)',
    ];

    let v =
      allVoices.find(
        (x) =>
          (x.lang && (x.lang === 'mr-IN' || x.lang.startsWith('mr'))) &&
          preferredVoiceNames.some((name) => x.name === name)
      ) ||
      allVoices.find(
        (x) =>
          (x.lang && (x.lang === 'mr-IN' || x.lang.startsWith('mr'))) &&
          ((x.gender && x.gender.toLowerCase() === 'female') ||
            /female|woman|स्त्री|महिला|महिलां/i.test(x.name))
      ) ||
      allVoices.find((x) => x.lang === 'mr-IN' || (x.lang && x.lang.startsWith('mr'))) ||
      allVoices.find(
        (x) =>
          (x.lang && (x.lang === 'hi-IN' || x.lang.startsWith('hi'))) &&
          (preferredVoiceNames.some((name) => x.name === name) ||
            (x.gender && x.gender.toLowerCase() === 'female') ||
            /female|woman|स्त्री|महिला|mahila/i.test(x.name))
      ) ||
      allVoices.find((x) => x.lang === 'hi-IN' || (x.lang && x.lang.startsWith('hi'))) ||
      (allVoices.length ? allVoices[0] : null);

    return v || null;
  };

  // Split the long text into smaller chunks for stable desktop TTS
  const chunkText = (text, maxLen = 220) => {
    const clean = convertDigitsToMarathiWords(text)
      .replace(/\r/g, '')
      .replace(/[–—]/g, '-')
      .replace(/\s+\n/g, '\n')
      .trim();

    // First split by double newline (paragraphs)
    const paragraphs = clean.split(/\n{2,}/);
    const chunks = [];

    paragraphs.forEach((p) => {
      const sentences = p.split(/([.!?।]|[\n])/).reduce((acc, cur) => {
        if (!acc.length) return cur ? [cur] : [];
        const last = acc[acc.length - 1];
        if (/([.!?।]|\n)$/.test(last)) {
          if (cur && cur !== '\n') acc.push(cur);
        } else {
          acc[acc.length - 1] = last + cur;
        }
        return acc;
      }, []);

      let buffer = '';
      sentences.forEach((s) => {
        const candidate = (buffer + ' ' + s).trim();
        if (candidate.length > maxLen && buffer) {
          chunks.push(buffer);
          buffer = s.trim();
        } else {
          buffer = candidate;
        }
      });
      if (buffer) chunks.push(buffer);
    });

    return chunks.filter(Boolean);
  };

  const buildUtterance = (text, selectedVoice) => {
    const u = new window.SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      u.voice = selectedVoice;
      u.lang = selectedVoice.lang;
    } else {
      u.lang = 'mr-IN';
    }
    // Match the working component params
    u.rate = 1;
    u.pitch = 1.01;
    u.volume = 1;
    return u;
  };

  const speakQueueFrom = (startIdx) => {
    indexRef.current = startIdx;

    const speakNext = () => {
      if (!queueRef.current.length || indexRef.current >= queueRef.current.length) {
        setIsReading(false);
        setIsPaused(false);
        speechRef.current = null;
        return;
      }

      const current = queueRef.current[indexRef.current];
      speechRef.current = current;

      current.onstart = () => {
        setIsReading(true);
        setIsPaused(false);
      };
      current.onend = () => {
        indexRef.current += 1;
        speakNext();
      };
      current.onerror = () => {
        indexRef.current += 1;
        speakNext();
      };

      window.speechSynthesis.speak(current);
    };

    speakNext();
  };

  const startReading = async () => {
    if (!('speechSynthesis' in window)) {
      alert('आपल्या ब्राउझरमध्ये वाचण्याची सुविधा उपलब्ध नाही. कृपया Chrome, Firefox, किंवा Safari वापरा.');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Wait briefly for desktop voices
      await ensureVoicesReady(2500);

      const selectedVoice = selectBestVoice(voices);
      const parts = chunkText(marathiContent);

      queueRef.current = parts.map((t) => buildUtterance(t, selectedVoice));
      if (!queueRef.current.length) return;

      speakQueueFrom(0);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      alert('वाचण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const pauseReading = () => {
    try {
      if (window.speechSynthesis && speechRef.current && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  };

  const resumeReading = () => {
    try {
      if (window.speechSynthesis && speechRef.current && isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Resume error:', error);
    }
  };

  const stopReading = () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setIsPaused(false);
        queueRef.current = [];
        indexRef.current = 0;
        speechRef.current = null;
      }
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  const handleBack = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    window.history.back();
  };

  if (!isSupported) {
    return (
      <div className="error-container">
        <div className="error-card">
          <button
            onClick={handleBack}
            className="back-button"
          >
            मागील पृष्ठ
          </button>
          <div className="error-message">
            <p className="error-title">आपल्या ब्राउझरमध्ये वाचण्याची सुविधा उपलब्ध नाही</p>
            <p className="error-subtitle">कृपया Chrome, Firefox, किंवा Safari वापरा</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="karyalaya-container">
      <div className="content-card">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="back-button"
        >
          मागील पृष्ठ
        </button>

        {/* Audio Controls */}
        <div className="audio-controls">
          {!isReading ? (
            <button
              onClick={startReading}
              className="audio-button play-button"
              title="वाचा सुरू करा"
            >
              <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              वाचा
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeReading}
                  className="audio-button resume-button"
                  title="पुन्हा सुरू करा"
                >
                  <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  सुरू
                </button>
              ) : (
                <button
                  onClick={pauseReading}
                  className="audio-button pause-button"
                  title="थांबवा"
                >
                  <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  थांबवा
                </button>
              )}
              <button
                onClick={stopReading}
                className="audio-button stop-button"
                title="पूर्ण थांबवा"
              >
                <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                थांबवा
              </button>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="page-title">
          तलासरी तालुका माहिती
        </h1>

        {/* Marathi Content */}
        <div className="content-text">
          {marathiContent.split('\n').map((line, idx) => {
            if (
              line.trim() === "मतदार संघ" ||
              line.trim() === "भौगोलीक माहीती-" ||
              line.trim() === "सांस्कृतिक वारसा"
            ) {
              return (
                <div key={idx}>
                  <span className="section-header">{line.trim()}</span>
                </div>
              );
            }
            return <div key={idx} className="whitespace-pre-line">{line}</div>;
          })}
        </div>

      </div>
    </div>
  );
};

export default Karyalaya;
