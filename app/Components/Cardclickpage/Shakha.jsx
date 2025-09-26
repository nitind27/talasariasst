"use client";
import React, { useState, useRef, useEffect } from "react";
// Removed image zoom since we no longer show images
import { useRouter } from "next/navigation";
import "./shakha.css";

// Schemes for "संगायो शाखा"
const sangayoSchemes = [
  {
    name: "संजय गांधी निराधार अनदान योजना",
    imgPath: "/pdfimage/1.jpg",
    contant: `महाराष्ट्र क शासन तहसिल कार्यालय तलासरी 
( संगांयो शाखा )
१.संजय गांधी निराधार अनुदान योजना पात्र लाभार्थी खालील अटीच्या अधिन राहुन पात्र होतील  ( निराधार विधवा, दिव्यांग- अस्थिव्यंग, अंध , मुकबधिर , मतिमंद, कर्णवधिर इत्यादी प्रवर्ग,क्षयरोग, पक्षघात , कर्करोग, एड्रस, कुष्ठरोग, सिकलसेल, घटस्फोट , अविवाहीत स्त्री ३५ वर्षापेक्षा जास्त, १८ वर्षाखालील अनाथ मुले व मुली ) 
संजय गांधी योजना नमुना अर्जांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत  १. स्वंय घोषणापत्र १५ वर्ष वास्तव्याचा दाखला/रहिवासी दाखला असणे आवश्यक आहे  २. वय- १८ ते ६५ वर्षापेक्षा कमी असावे . ( आधार कार्ड नुसार वयात बसणे आवश्यक आहे.) ३.माझी लाडकी बहिण योजनेचे स्वंयघोषणा पत्र असणे आवश्यक आहे 
४. पतीचा चा मृत्यु झाल्यास प्रमाणपत्र झेरॉक्स (ग्रामपंचायत/नगरपंचायतच्या मृत्यू नोंदवहीतील 
उतारा सादर करणे आवश्यक राहील.) 
५.अर्जंदाराचे नाव शिधापत्रिका मथ्ये असणे आवश्यक आहे / छायांकित प्रत जोडावी ६. अर्जदाराचे नांव असलेले आधारकार्डची छावांकित प्रत आवश्यक आहे . बैंकेला आधारकार्ड लिंक करणे आवश्यक आहे.) 
७.अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्रत आवश्यक आहे . ८.पुर्नवाह न केलेले स्वंय घोषणापत्र आवश्यक आहे  ९.घरपट्टी उतारा छायांकित प्रत आवश्यक आहे  
१०. अर्जदाराच्या कुटुंबातील नाव असलेले ( रेशनकार्ड मधील) दारिद्रये रेखेखालील दाखला व 
नावाची यादीची प्रत.किंवा नाव नसल्यास कटंबाचे वार्षिक उत्पन्नाचा दाखला-२१००० / - आत 
तहसिल कार्यालयाकडून दाखला घेणे आवश्यक आहे 
११. दिव्यागं असले किमान ४० % पेक्षा जास्त असलेले प्रमाणपत्र जिल्हा शल्य चिकित्सक 
( सिव्हिल सर्जन ) यांचे प्रमाणपत्र बंधनकारक राहिल . (अस्थिव्यंग, अंध , मुकबधिर , मतिमंद 
.कर्णवधिर इत्यादी प्रवर्गातील ) दिव्यागं असलेस उत्पन्न मर्यादा ५०००० / - पर्यंत आहे `
  },
  {
    name: "श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना",
    imgPath: "/pdfimage/2.jpg",
    contant: `महाराष्ट् शासन 
तहसिल कार्यालय तलासरी 
(संगांयो शाखा ) 
२.श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना 
पात्र लाभार्थी खालील अटीच्या अधिन राहुन पात्र होतील 
श्रावणबाळ योजना नमुना अर्जांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत 
१. स्वंय घोषणापत्र १५ वर्ष वास्तव्याचा दखला/रहिवासी दाखला असणे आवश्यक आहे. 
२. वय६५ व ६५ वर्षावरी असावे . आधार कार्ड नुसार वयात बसणे आवश्यक आहे.) 
३.अर्जंदाराचे नांव असलेले शिधापत्रिकाची छायांकित प्रत असणे आवश्यक आहे. 
४.अर्जदाराचे नांव असलेले आधारकार्डची छायांकित प्रत आवश्यकआहे. 
५.अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्रत आवश्यक आहे . ( बँकेला आधारकार्ड लिंक करणे आवश्यक आहे.  
६. घरपट्टी उताराछायांकित प्रत आवश्यक आहे  
७.अर्जदाराच्या कुटुमतील नाव असलेले (शिधापत्रिका मधील ) दारिद्रये रेषेालील दाखला व नावाची यादीची प्रत. किंवा नाव नसल्यास कुटूंबाचे वार्षिक उत्पन्नाचा दाखला-२१००० / - आत तहसिल कार्यालयाकडून दाखला घेणे आवश्यक आहे. 


`
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय वृध्दापकाळ निवृत्तीवेतन योजना",
    imgPath: "/pdfimage/3.jpg",
    contant: `महाराष्ट् un शासन 
तहसिल कार्यालय तलासरी 
( संगांयो शाखा) 
३. इंदिरा गांधी राष्ट्रीय वृध्दापकाळ निवृत्तीवेतन योजना 
पात्र लाभार्थी खालील अटीच्या अधिन राहुन पात्र होतील 
इंदिरा गांधी राष्ट्री वृध्दापकाळ निवृत्तीवेतन योजना नमुना अर्ांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत  
१. स्वंय घोषणापत्र १५ वर्ष वास्तव्याचा दाखला/रहिवासी दाखला असणे आवश्यक आहे. 
२. वय- ६५ व ६ वर्षावरील असावे . आधार कार्ड नुसार वयात बसणे आवश्यक आहे.) 
३. अर्जंदाराचे नांव असलेले शिधापत्रिकाची छायांकित प्रत असणे आवश्यक आहे. 
४.अर्जदाराचे नांव असलेले आधारकार्डची छायांकित प्रत आवश्यक आहे . ( बँकेला आधारकार् लिंक करणे आवश्यक आहे.) 
५.अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्रत आवश्यक आहे 
६. घरपट्टी उतारा छायांकित प्रत आवश्यक आहे. 
७. दिव्यागं किमान ८०१ पेक्ष जास्त असलेले प्रमाणपत्र जिल्हा शल्य चिकित्सक  ( सिव्हिल सर्जन ) यांचे प्रमाणपत्र बंधनकारक राहिल . ( अस्थिव्यंग, अंध , मुकबधिर , मतिमंद , कर्णबधिर इत्यादी प्रवर्गातील) 
८. अर्जदाराच्या कुटुंबातील नाव असलेले (शिधापत्रिा मधील ) दारिद्रये रेषेखालील दाखला व नावाची यादीत नांव असणे आवश्यक आहे.`
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना",
    imgPath: "/pdfimage/4.jpg",
    contant: `महाराष्ट 
u 
शासन 
तहसिल कार्यालय तलासरी 
(संगांयो शाखा ) ४.इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना 
पात्र लाभार्थी खालील अटीच्या अधिन राहुन पात्र होतील इंदिरा गांध राष्ट्रीय विधवा निवृत्तीवेतन योजना नमुना अर्जांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत. 
१. स्वंय घोषणापत्र १५ वर्षं वास्तव्याचा दाखला/ रहिवासी दाखला असणे आवश्यक आहे. 
२. वय- ४० व ७९ वर्षावरल विधवा असावे .( आधार कार्ड नुसार वयात बसणे आवश्यकआहे.) 
 ३. अर्जंदाराचे नांव असलेले शिधापत्रिकाची छायांकित प्रत असणे आवश्यक आहे 
४. अर्जदाराचे नांव असलेले आधारकार्डची छायांकित प्रत आवश्यक आहे  
५.अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्रत आवश्यक आहे. 
६. घरपट्टी उतारा छायांकित प्रत आवश्यक आहे. 
७.माझी लाडकी बहिण योजनेचे स्वयघोणा पत्र असणे आवश्यक आहे. 
८. पतीचा चा मृत्यु झाल्यास प्रमाणपत्र छायांकित प्रत (ग्रामपंचायत /नगरपंचायतच्या मृत्य  नोंदवहीतील उतारा सादर करणे आवश्यक राहील.) 
९. पुर्नविवाह न केलेले स्वंय घोषापत्र आवश्यक आहे 
 १०. अर्जदाराच्या कुटुंबातील नाव असलेले ( शिधापत्रिका मधील) दारिद्रये रेषेखालील दाखला व नावाची यादीत नांव असणे आवश्यक आहे`
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय दिव्यांग निवृत्तीवेतन योजना",
    imgPath: "/pdfimage/5.jpg",
    contant: `महाराष्ट् 
u 
शासन 
 तहसिल कार्यालय तलासरी 
( संगांयो शाखा ) 
५. इंदिरा गांधी राष्ट्रीय दिव्यांग निवृत्तीवेतन योजना 
 पात्र लाभार्थी खालील अटीच्या अधिन राहुन पात्र होतील 
इंदिरा गांधी राष्ट्रीय दिव्यांग निवृत्तीवेतन योजना नमुना अर्जांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत. 
१. स्वंय घोषणापत्र १५ वर्ष वास्तव्याचा दाखला/रहिवाी दाखला असणे आवश्यक आहे. 
२. वय- ४० व ७९ व्षावरील दिव्यांग असावे . आधार कार्ड नुसार वयात बसणे आवश्यक आहे. 
३.अर्जंदाराचे नांव असलेले शिधापत्रिकाी छायांकित प्रत असणे आवश्यक आहे. 
४.अर्जदाराचे नांव असलेले आधारकार्डची छायांकित प्रत आवश्यक आहे 
५.अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्र आवश्यक आहे. 
६.घरपट्टी उतारा छायांकित प्रतआवश्यक आहे. 
७. दिव्यागं किमान ८०१ पेक्ष जास्त असलेले प्रमाणपत्र जिल्हा शल्य चिकित्सक  ( सिव्हिल सर्जन ) यांचे प्रमाणपत्र बंधनकारक राहिल . ( अस्थिव्यंग, अंध , मुकबधिर , मतिमंद , कर्णबधिर इत्यादी प्रवर्गातील) 
८. अर्जदाराच्या कुटुंबातील नाव असलेले (शिधापत्रिा मधील ) दारिद्रये रेषेखालील दाखला व नावाची यादीत नांव असणे आवश्यक आहे.`
  },
  {
    name: "राष्ट्रीय कुटुंब अर्थसहाय्य लाभ योजना",
    imgPath: "/pdfimage/6.jpg",
    contant: `महाराष्ट्र स  शासन ' तहसिल कार्यालय तलासरी ( संगांयो शाखा ) ६. राष्ट्रीय कुटुंब अर्थसहाय्य लाभ योजना 
 पात्र लाभार्थीखालील अटीच्या अधिन राहुन पात्र होतील 
राष्ट्रीय कुटुंब अर्थसहाय्य लाभ योजना नमुना अर्जांसोबत खालील कागदपत्रे जोडणे आवश्यक आहेत 
१. स्वंय घोषणापत्र १५ वर्षं वास्तव्याचा दाखला/रहिवासी दाखला असणे आवश्यक आहे. 
 २. वय- १८ व ५९ वर्षावरील विधवा असावे .( आधार कार्ड नुसार वयात बसणे आवश्यक आहे.) 
३. अर्जंदाराचे नांव असलेले शिधापत्रिकाची छायांकित प्रत असणे आवश्यक आहे. 
४.अर्जदाराचे नांव असलेले आधारकार्डची छायांकित प्रत आवश्यक आहे. 
५. अर्जदाराचे नांव असलेले बँक पास बुक छायांकित प्रत आवश्यक आहे. 
६. घरपट्टी उतारा छायांकित प्रत आवश्यक आहे. 
७. माझी लाडकी बहिण योजनेचे स्वंघोषणा पत्र असणे आवश्यक आहे  
८. पती/ पत्नीचा मृत्यु (३ वर्षाच्या आत) झाल्यास प्रमाणपत्राची छायांित प्रत (ग्रामपंचायत / नगरपंचायतच्या मृत्यू नोंदवहीतील उतारा सादर करणे आवश्यक राहील.) 
९.पुर्नविवाह न केलेले स्वंय घोषणापत्र आवश्यक आहे . 
१०. अर्जदाराच्या कटुंबातील नाव असलेले (शिधापत्रिका मधील) दारिद्रये रेषेखालील दाखला व नावाची यादीत नांव असणे आवश्यक आहे.`
  },
];

// Fixed puravathaList with correct PDF paths
const puravathaList = [
  {
    name: "विभक्त शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/1.pdf",
  },
  {
    name: "दुय्यम शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/2.pdf",
  },
  {
    name: "शिधापत्रिकेत नाव समाविष्ट करण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/3.pdf",
  },
  {
    name: "नवीन शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/4.pdf",
  },
  {
    name: "शिधापत्रिकेतून नाव काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/5.pdf",
  },
];

const sections = [
  {
    title: "महसूल शाखा",
    icon: "📜",
    color: "gradient-yellow",
    info: [
      "जमीनबाब/गौणखनिज",
      "हक्कनोंद",
      "आस्थापना",
      "फौजदारी",
    ],
  },
  {
    title: "संगायो शाखा",
    icon: "📂",
    color: "gradient-green",
    info: sangayoSchemes.map(s => s.name),
    pdfMap: sangayoSchemes,
  },
  {
    title: "पुरवठा शाखा",
    // icon: "⚙️",
    img: "/cardimage/card1purvatha.png",
    color: "gradient-blue",
    info: puravathaList.map(s => s.name),
    pdfMap: puravathaList,
  },
  {
    title: "मग्रारोहयो",
    icon: "🏛️",
    color: "gradient-pink",
    info: [],
  },
  {
    title: "प्रशासन",
    icon: "🗄️",
    color: "gradient-purple",
    info: [
      "दाखले",
      "अभिलेख कक्ष",
      "संकीर्ण विषयक",
    ],
  },
  {
    title: "आवक जावक",
    icon: "✉️",
    color: "gradient-orange",
    info: [],
  },
];

const BackIcon = () => (
  <svg className="back-button-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

// PDF Viewer Component
const PDFViewer = ({ onBack, src, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError("PDF लोड करण्यात त्रुटी आली आहे");
    setIsLoading(false);
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <button
          className="pdf-back-button"
          onClick={onBack}
          aria-label="Back"
        >
          <BackIcon />
          <span className="back-button-text">बॅक</span>
        </button>
        <span className="pdf-title">{title}</span>
        <a
          href={src}
          download
          className="pdf-download-button"
          aria-label="Download PDF"
        >
          <svg className="pdf-download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="pdf-download-text">डाउनलोड</span>
        </a>
      </div>
      <div className="pdf-content">
        {isLoading && (
          <div className="pdf-loading">
            <div className="pdf-loading-spinner"></div>
            <p className="pdf-loading-text">PDF लोड होत आहे...</p>
          </div>
        )}
        {error && (
          <div className="pdf-error">
            <div className="pdf-error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="pdf-error-text">{error}</p>
            <button
              onClick={() => window.open(src, '_blank')}
              className="pdf-error-button"
            >
              ब्राउझर मध्ये उघडा
            </button>
          </div>
        )}
        <iframe
          src={`${src}#toolbar=1&navpanes=1&scrollbar=1`}
          className={`pdf-iframe ${isLoading || error ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          title={title}
        />
      </div>
    </div>
  );
};

// TEXT Viewer Component (replaces image viewer)
const TextViewer = ({ onBack, title, content }) => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voicesReady, setVoicesReady] = useState(false);

  const currentUtterRef = useRef(null);
  const queueRef = useRef([]);
  const indexRef = useRef(0);

  const digitMap = { '0': 'शून्य','1': 'एक','2': 'दोन','3': 'तीन','4': 'चार','5': 'पाच','6': 'सहा','7': 'सात','8': 'आठ','9': 'नऊ' };
  const convertDigitsToMarathiWords = (text) => (text || "").replace(/\d/g, (d) => digitMap[d] || d);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices() ?? [];
        setVoices(list);
        if (list.length) setVoicesReady(true);
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    } else {
      setVoices([]);
      setVoicesReady(false);
    }
  }, []);

  const ensureVoicesReady = async (timeoutMs = 2500) => {
    if (!("speechSynthesis" in window)) return false;
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

  const selectBestVoice = (allVoices) => {
    const preferredVoiceNames = [
      "Google मराठी","Google हिन्दी","Google Hindi (India)","Google हिंदी (भारत)","Google female",
      "Microsoft Heera Desktop - Hindi (India)","Microsoft Kalpana Desktop - Hindi (India)",
    ];
    return (
      allVoices.find(v => (v.lang && (v.lang === "mr-IN" || v.lang.startsWith("mr"))) && preferredVoiceNames.some(name => v.name === name)) ||
      allVoices.find(v => (v.lang && (v.lang === "mr-IN" || v.lang.startsWith("mr"))) && ((v.gender && v.gender.toLowerCase() === "female") || /female|woman|स्त्री|महिला|महिलां/i.test(v.name))) ||
      allVoices.find(v => v.lang === "mr-IN" || (v.lang && v.lang.startsWith("mr"))) ||
      allVoices.find(v => (v.lang && (v.lang === "hi-IN" || v.lang.startsWith("hi"))) && (preferredVoiceNames.some(name => v.name === name) || (v.gender && v.gender.toLowerCase() === "female") || /female|woman|स्त्री|महिला|mahila/i.test(v.name))) ||
      allVoices.find(v => v.lang === "hi-IN" || (v.lang && v.lang.startsWith("hi"))) ||
      (allVoices.length ? allVoices[0] : null)
    ) || null;
  };

  const chunkText = (text, maxLen = 220) => {
    const clean = convertDigitsToMarathiWords((text || ""))
      .replace(/\r/g, "").replace(/[–—]/g, "-").replace(/\s+\n/g, "\n").trim();
    const paragraphs = clean.split(/\n{2,}/);
    const chunks = [];
    paragraphs.forEach((p) => {
      const parts = p.split(/([.!?।]|\n)/);
      const sentences = [];
      for (let i = 0; i < parts.length; i += 2) {
        const seg = (parts[i] || "").trim();
        const punct = parts[i + 1] || "";
        if (seg) sentences.push((seg + punct).trim());
      }
      let buffer = "";
      sentences.forEach((s) => {
        const candidate = (buffer + " " + s).trim();
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
      u.lang = "mr-IN";
    }
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
        currentUtterRef.current = null;
        return;
      }
      const current = queueRef.current[indexRef.current];
      currentUtterRef.current = current;
      current.onstart = () => { setIsReading(true); setIsPaused(false); };
      current.onend = () => { indexRef.current += 1; speakNext(); };
      current.onerror = () => { indexRef.current += 1; speakNext(); };
      window.speechSynthesis.speak(current);
    };
    speakNext();
  };

  const startReading = async () => {
    if (!("speechSynthesis" in window)) {
      alert("आपल्या ब्राउझरमध्ये वाचण्याची सुविधा उपलब्ध नाही. कृपया Chrome, Firefox, किंवा Safari वापरा.");
      return;
    }
    if (!content || content.trim().length < 2) return;
    try {
      window.speechSynthesis.cancel();
      await ensureVoicesReady(2500);
      const selectedVoice = selectBestVoice(voices);
      const chunks = chunkText(content);
      queueRef.current = chunks.map((t) => buildUtterance(t, selectedVoice));
      if (!queueRef.current.length) return;
      speakQueueFrom(0);
    } catch (e) {
      console.error("Speech synthesis error:", e);
      alert("वाचण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    }
  };

  const stopReading = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setIsPaused(false);
        queueRef.current = [];
        indexRef.current = 0;
        currentUtterRef.current = null;
      }
    } catch {}
  };

  // Format raw text into paragraphs and a numbered list (if lines start with 1., १., 2), २) etc.)
  const renderFormattedContent = (raw) => {
    if (!raw) return null;
    const lines = (raw || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    const numRe = /^((\d+|[०१२३४५६७८९]+)[\.\)])\s*/; // 1. / १. / 1) / १)
    const items = [];
    const paras = [];
    lines.forEach(l => {
      if (numRe.test(l)) {
        items.push(l.replace(numRe, (m) => "" + m));
      } else {
        paras.push(l);
      }
    });

    return (
      <div className="doc">
        {paras.length > 0 && paras.slice(0, 3).map((p, i) => (
          <p key={"p-top-" + i} className={"doc-p " + (i === 0 ? "doc-title" : i === 1 ? "doc-subtitle" : "")}>
            {p}
          </p>
        ))}
        <div className="doc-separator"></div>
        {items.length > 0 ? (
          <ol className="doc-ol">
            {items.map((it, i) => (
              <li key={"li-" + i} className="doc-li">{it}</li>
            ))}
          </ol>
        ) : (
          paras.slice(3).map((p, i) => (
            <p key={"p-rest-" + i} className="doc-p">{p}</p>
          ))
        )}
      </div>
    );
  };
  return (
    <div className="image-viewer">
      <div className="image-header">
        <button
          className="image-back-button"
          onClick={() => { stopReading(); onBack(); }}
          aria-label="Back"
        >
          <BackIcon />
          <span className="back-button-text">बॅक</span>
        </button>
        <span className="image-title">{title}</span>
        {(content && content.length > 12) && (
          <button
            onClick={() => (isReading ? stopReading() : startReading())}
            className={`image-speak-button ${isReading ? 'speaking' : 'not-speaking'}`}
            aria-label={isReading ? "थांबवा" : "वाचा"}
            title={isReading ? "थांबवा" : "वाचा सुरू करा"}
            type="button"
          >
            <svg className={`image-speak-icon ${isReading ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isReading ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18v4m-4 0h8m4-8a8 8 0 10-16 0 8 8 0 0016 0z" />
              )}
            </svg>
            <span className="image-speak-text">
              {isReading ? "थांबवा" : "वाचा"}
            </span>
          </button>
        )}
      </div>

       {/* Text content instead of image */}
       <div className="image-content">
        <div className="text-content">
          {renderFormattedContent(content)}
        </div>
      </div>
    </div>
  );
};

const ShakhaGrid = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [showText, setShowText] = useState(null);
  const [showPDF, setShowPDF] = useState(null);
  const rows = [];
  for (let i = 0; i < sections.length; i += 3) rows.push(sections.slice(i, i + 3));

  const handleBack = () => {
    router.back();
  };

  const DetailCard = ({ section, onBack }) => {
    const textSections = ["संगायो शाखा"]; // show text instead of images
    const pdfSections = ["पुरवठा शाखा"];
    const hasText = textSections.includes(section.title) && section.pdfMap;
    const hasPDFs = pdfSections.includes(section.title) && section.pdfMap;

    return (
      <div className="detail-modal">
        <div className={`detail-card ${section.color}`}>
          <button
            className="detail-card-back-button"
            onClick={onBack}
          >
            <BackIcon />
            <span className="back-button-text">बॅक</span>
          </button>
          <div className="detail-content">
            <div className="detail-icon">{section.icon}</div>
            <div className="detail-title">{section.title}</div>
            {section.info && section.info.length > 0 ? (
              <ul className="detail-list">
                {section.info.map((item, idx) => (
                  <li
                    key={item}
                    className={`detail-list-item ${hasText || hasPDFs ? 'pdf-hover' : ''}`}
                    onClick={
                      hasText
                        ? () =>
                            setShowText({
                              title: item,
                              content: section.pdfMap[idx]?.contant,
                            })
                        : hasPDFs
                          ? () =>
                            setShowPDF({
                              title: item,
                              path: section.pdfMap[idx]?.pdfPath,
                            })
                          : undefined
                    }
                  >
                    {idx + 1}) {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="detail-placeholder">
                सदर शाखेसाठी तपशील लवकरच ...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shakha-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button
          onClick={handleBack}
          className="back-button"
        >
          <BackIcon />
          <span className="back-button-text">मागील पृष्ठ</span>
        </button>
      </div>

      <div className="content-wrapper">
        <h1 className="page-title animate-fadeIn">
          शाखा
        </h1>
        <div className="rows-container">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="row">
              {row.map((section, idx) => (
                <button
                  key={section.title}
                  className={`section-button ${section.color}`}
                  onClick={() => setSelected(rowIdx * 3 + idx)}
                  tabIndex={0}
                  type="button"
                >
                  <div className="section-icon animate-pop">
                    {
                      section.title == "पुरवठा शाखा" &&
                      <img src={section.img} alt="पुरवठा शाखा" className="purvathaimage"/>
                    }
                    {section.icon}
                  </div>
                  <div className="section-title">
                    {section.title}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {selected !== null && (
        <DetailCard section={sections[selected]} onBack={() => setSelected(null)} />
      )}
      {showText && (
        <TextViewer
          title={showText.title}
          content={showText.content}
          onBack={() => setShowText(null)}
        />
      )}
      {showPDF && (
        <PDFViewer
          src={showPDF.path}
          title={showPDF.title}
          onBack={() => setShowPDF(null)}
        />
      )}
    </div>
  );
};

export default ShakhaGrid;
