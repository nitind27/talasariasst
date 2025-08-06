'use client'
import React, { useState, useRef, useEffect } from 'react';

const Karyalaya = () => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voice, setVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceLoading, setVoiceLoading] = useState(true);
  const speechRef = useRef(null);

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

  // Replace digits with Marathi words
  const convertDigitsToMarathiWords = (text) => {
    return text.replace(/\d/g, (digit) => digitMap[digit] || digit);
  };

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
      setVoiceLoading(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      setVoiceLoading(false);
      
      if (voices.length > 0) {
        // Log available voices for debugging
        console.log('Available voices:', voices.map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          gender: v.gender
        })));

        // Enhanced voice selection strategy for Marathi
        let selectedVoice = null;

        // Strategy 1: Find Marathi female voice with specific names
        const marathiFemaleNames = [
          "Google मराठी",
          "Microsoft Heera Desktop - Hindi (India)",
          "Microsoft Kalpana Desktop - Hindi (India)",
          "Google हिन्दी",
          "Google Hindi (India)",
          "Google हिंदी (भारत)"
        ];

        selectedVoice = voices.find(v => 
          (v.lang === 'mr-IN' || v.lang.startsWith('mr')) &&
          marathiFemaleNames.some(name => v.name.includes(name))
        );

        // Strategy 2: Find any Marathi voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            v.lang === 'mr-IN' || v.lang.startsWith('mr')
          );
        }

        // Strategy 3: Find Hindi female voice (good for Marathi)
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            (v.lang === 'hi-IN' || v.lang.startsWith('hi')) &&
            (v.gender === 'female' || /female|woman|स्त्री|महिला|mahila/i.test(v.name))
          );
        }

        // Strategy 4: Find any Hindi voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            v.lang === 'hi-IN' || v.lang.startsWith('hi')
          );
        }

        // Strategy 5: Find any female voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            (v.gender && v.gender.toLowerCase() === 'female') ||
            /female|woman|स्त्री|महिला|mahila/i.test(v.name)
          );
        }

        // Strategy 6: Fallback to any available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }

        if (selectedVoice) {
          setVoice(selectedVoice);
          console.log('Selected voice:', selectedVoice.name, selectedVoice.lang);
        } else {
          setVoice(null);
          console.log('No suitable voice found');
        }
      }
    };

    // Handle voice loading with timeout
    const timeoutId = setTimeout(() => {
      if (voiceLoading) {
        setVoiceLoading(false);
        loadVoices();
      }
    }, 3000);

    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timeoutId);
      loadVoices();
    };
    
    // Initial load
    loadVoices();

    return () => {
      clearTimeout(timeoutId);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  const startReading = () => {
    if (!window.speechSynthesis) {
      alert('आपल्या ब्राउझरमध्ये वाचण्याची सुविधा उपलब्ध नाही. कृपया Chrome, Firefox, किंवा Safari वापरा.');
      return;
    }

    if (voiceLoading) {
      alert('आवाज लोड होत आहे. कृपया थोडा वेळ थांबा.');
      return;
    }

    if (!voice && availableVoices.length === 0) {
      alert('कोणताही आवाज उपलब्ध नाही. कृपया ब्राउझर रीफ्रेश करा किंवा इतर ब्राउझर वापरा.');
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Convert digits to Marathi words before speaking
      const textToSpeak = convertDigitsToMarathiWords(marathiContent);

      const utterance = new window.SpeechSynthesisUtterance(textToSpeak);
      
      // Enhanced voice and language settings
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
        console.log('Using voice:', voice.name, 'with lang:', voice.lang);
      } else {
        // Fallback language settings
        utterance.lang = 'mr-IN';
        console.log('Using fallback language: mr-IN');
      }
      
      // Optimized speech parameters for Marathi
      utterance.rate = 0.75; // Slower for better pronunciation
      utterance.pitch = 1.1; // Slightly higher pitch for female-like sound
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsReading(true);
        setIsPaused(false);
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
        speechRef.current = null;
        console.log('Speech ended');
      };
      
      utterance.onpause = () => {
        setIsPaused(true);
        console.log('Speech paused');
      };
      
      utterance.onresume = () => {
        setIsPaused(false);
        console.log('Speech resumed');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsReading(false);
        setIsPaused(false);
        speechRef.current = null;
        
        // Detailed error handling
        let errorMessage = 'वाचण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'वाचण्यासाठी परवानगी आवश्यक आहे. कृपया ब्राउझर सेटिंग्ज तपासा.';
            break;
          case 'network':
            errorMessage = 'नेटवर्क समस्या. कृपया इंटरनेट कनेक्शन तपासा.';
            break;
          case 'not-supported':
            errorMessage = 'हा आवाज समर्थित नाही. कृपया इतर ब्राउझर वापरा.';
            break;
          case 'interrupted':
            errorMessage = 'वाचणे थांबवले गेले.';
            break;
          case 'audio-busy':
            errorMessage = 'आवाज व्यापलेला आहे. कृपया थोडा वेळ थांबा.';
            break;
          case 'audio-hardware':
            errorMessage = 'साउंड सिस्टम समस्या. कृपया साउंड सेटिंग्ज तपासा.';
            break;
          default:
            errorMessage = `वाचण्यात त्रुटी आली (${event.error}). कृपया पुन्हा प्रयत्न करा.`;
        }
        
        alert(errorMessage);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
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
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 relative">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
          >
            मागील पृष्ठ
          </button>
          <div className="text-center text-red-600 mt-8">
            <p className="text-lg font-semibold">आपल्या ब्राउझरमध्ये वाचण्याची सुविधा उपलब्ध नाही</p>
            <p className="text-sm mt-2">कृपया Chrome, Firefox, किंवा Safari वापरा</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow transition-colors"
        >
          मागील पृष्ठ
        </button>

        {/* Audio Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {!isReading ? (
            <button
              onClick={startReading}
              disabled={voiceLoading}
              className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105  ${
                voiceLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={voiceLoading ? "आवाज लोड होत आहे..." : "वाचा सुरू करा"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              {voiceLoading ? "लोड..." : "वाचा"}
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeReading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                  title="पुन्हा सुरू करा"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                  title="थांबवा"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                title="पूर्ण थांबवा"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Voice Info */}
  
        {/* Loading Indicator */}
        {voiceLoading && (
          <div className="text-center text-sm text-blue-600 mb-4">
            <p>आवाज लोड होत आहे...</p>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mt-10 md:mt-0">
          तलासरी तालुका माहिती
        </h1>

        {/* Marathi Content */}
        <div className="text-justify text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
          {marathiContent}
        </div>
      </div>
    </div>
  );
};

export default Karyalaya;
