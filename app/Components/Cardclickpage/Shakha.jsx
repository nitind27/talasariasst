"use client";
import React, { useState, useRef, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useRouter } from "next/navigation";
import "./shakha.css";

// Schemes for "संगायो शाखा"
const sangayoSchemes = [
  {
    name: "संजय गांधी निराधार अनदान योजना",
    imgPath: "/pdfimage/1.jpg",
    contant: `महाराष्ट्र क शासन तहसिल कार्यालय तलासरी 
( संगांयो शाखा  
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
    contant: `महाराष्ट् 
un 
शासन 
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

const ImageViewerFull = ({ onBack, src, title, content }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    } else {
      setVoices([]);
    }
  }, []);

  const speakText = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if ("speechSynthesis" in window && content) {
      const utter = new window.SpeechSynthesisUtterance(content);
      utter.lang = "mr-IN";
      utter.rate = 0.88;
      utter.pitch = 1.08;

      const preferred = voices.find(v => v.lang === "mr-IN" && v.name.toLowerCase().includes("female"));
      const marathi = voices.find(v => v.lang === "mr-IN");
      const hindiFemale = voices.find(v => v.lang === "hi-IN" && v.name.toLowerCase().includes("female"));
      const hindi = voices.find(v => v.lang === "hi-IN");
      const enFemale = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));

      utter.voice = preferred || marathi || hindiFemale || hindi || enFemale || voices[0];

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="image-viewer">
      <div className="image-header">
        <button
          className="image-back-button"
          onClick={onBack}
          aria-label="Back"
        >
          <BackIcon />
          <span className="back-button-text">बॅक</span>
        </button>
        <span className="image-title">{title}</span>
        {(content && content.length > 12) && (
          <button
            onClick={speakText}
            className={`image-speak-button ${isSpeaking ? 'speaking' : 'not-speaking'}`}
            aria-label={isSpeaking ? "थांबवा" : "वाचा"}
          >
            <svg className={`image-speak-icon ${isSpeaking ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSpeaking ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 5.636a9 9 0 11-12.728 0M12 17v4m-4 0h8" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18v4m-4 0h8m4-8a8 8 0 10-16 0 8 8 0 0016 0z" />
              )}
            </svg>
            <span className="image-speak-text">
              {isSpeaking ? "थांबवा" : "वाचा"}
            </span>
          </button>
        )}
      </div>
      <div className="image-content">
        <Zoom>
          <img
            alt={title + " Image"}
            src={src}
            className="image-zoom"
          />
        </Zoom>
      </div>
    </div>
  );
};

const ShakhaGrid = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [showPDF, setShowPDF] = useState(null);
  const rows = [];
  for (let i = 0; i < sections.length; i += 3) rows.push(sections.slice(i, i + 3));

  const handleBack = () => {
    router.back();
  };

  const DetailCard = ({ section, onBack }) => {
    const imageSections = ["संगायो शाखा"];
    const pdfSections = ["पुरवठा शाखा"];
    const hasImages = imageSections.includes(section.title) && section.pdfMap;
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
                    className={`detail-list-item ${hasImages || hasPDFs ? 'pdf-hover' : ''}`}
                    onClick={
                      hasImages
                        ? () =>
                          setShowImage({
                            title: item,
                            path: section.pdfMap[idx]?.imgPath,
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
      {showImage && (
        <ImageViewerFull
          src={showImage.path}
          title={showImage.title}
          content={showImage.content}
          onBack={() => setShowImage(null)}
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
