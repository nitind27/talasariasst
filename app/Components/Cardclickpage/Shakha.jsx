"use client";
import React, { useState, useRef, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useRouter } from "next/navigation";

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
७. अर्जदाराच्या कुटुंबातील नाव असलेले ( शिधापत्रिका मधील) दारिद्रये रेषेखालील दाखला व नावाची यादीत नांव असणे आवश्यक आहे.`
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

const puravathaList = [
  {
    name: "विभक्त शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    imgPath: "/images/purvatha/1.jpg",
  },
  {
    name: "दुय्यम शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    imgPath: "/images/purvatha/2.jpg",
  },
  {
    name: "शिधापत्रिकेत नाव समाविष्ट करण्यासाठी लागणारी आवश्यक कागदपत्",
    imgPath: "/images/purvatha/3.jpg",
  },
  {
    name: "नवीन शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    imgPath: "/images/purvatha/4.jpg",
  },
  {
    name: "शिधापत्रिकेतून नाव काढण्यासाठी लागणारी आवश्यक कागदपत्",
    imgPath: "/images/purvatha/5.jpg",
  },
];

const sections = [
  {
    title: "महसूल शाखा",
    icon: "📜",
    color: "from-yellow-100 to-yellow-200",
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
    color: "from-green-100 to-green-200",
    info: sangayoSchemes.map(s => s.name),
    pdfMap: sangayoSchemes,
  },
  {
    title: "पुरवठा शाखा",
    icon: "⚙️",
    color: "from-blue-100 to-blue-200",
    info: puravathaList.map(s => s.name),
    pdfMap: puravathaList,
  },
  {
    title: "मग्रारोहयो",
    icon: "🏛️",
    color: "from-pink-100 to-pink-200",
    info: [],
  },
  {
    title: "प्रशासन",
    icon: "🗄️",
    color: "from-purple-100 to-purple-200",
    info: [
      "दाखले",
      "अभिलेख कक्ष",
      "संकीर्ण विषयक",
    ],
  },
  {
    title: "आवक जावक",
    icon: "✉️",
    color: "from-orange-100 to-orange-200",
    info: [],
  },
];

const BackIcon = () => (
  <svg className="h-7 w-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ImageViewerFull = ({ onBack, src, title, content }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
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

      // Prefer Marathi female; fallback to Hindi/en/female, then last hope
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
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 to-green-200 z-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2 bg-white/80 shadow-lg">
        <button
          className="flex items-center gap-1 bg-white/95 hover:bg-green-50 text-green-700 rounded-lg px-4 py-2 shadow border border-green-100 transition-all duration-200 group"
          onClick={onBack}
          aria-label="Back"
        >
          <BackIcon />
          <span className="text-base font-medium group-hover:underline">बॅक</span>
        </button>
        <span className="ml-4 font-bold text-lg text-green-900">{title}</span>
        {(content && content.length > 12) && (
          <button
            onClick={speakText}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg shadow border transition-all duration-200 ${isSpeaking
              ? "bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
              : "bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
              }`}
            aria-label={isSpeaking ? "थांबवा" : "वाचा"}
          >
            <svg className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSpeaking ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 5.636a9 9 0 11-12.728 0M12 17v4m-4 0h8" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18v4m-4 0h8m4-8a8 8 0 10-16 0 8 8 0 0016 0z" />
              )}
            </svg>
            <span className="text-sm font-medium">
              {isSpeaking ? "थांबवा" : "वाचा"}
            </span>
          </button>
        )}
      </div>
      <div className="flex-1 w-full flex items-center justify-center overflow-auto p-6">
        <Zoom>
          <img
            alt={title + " Image"}
            src={src}
            className="rounded-lg shadow-lg"
            style={{
              display: "block",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "80vh",
              cursor: "zoom-in",
            }}
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
  const rows = [];
  for (let i = 0; i < sections.length; i += 3) rows.push(sections.slice(i, i + 3));

  const handleBack = () => {
    router.back();
  };

  const DetailCard = ({ section, onBack }) => {
    const imageSections = ["संगायो शाखा", "पुरवठा शाखा"];
    const hasImages = imageSections.includes(section.title) && section.pdfMap;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
        <div className={`relative w-full max-w-md mx-auto rounded-3xl bg-gradient-to-br ${section.color} px-6 py-10 shadow-2xl border border-gray-200`}>
          <button
            className="absolute top-5 left-5 flex items-center gap-1 bg-white/90 hover:bg-blue-50 text-blue-700 rounded-lg px-4 py-2 shadow border border-blue-100 transition duration-200 group"
            onClick={onBack}
          >
            <BackIcon />
            <span className="text-base font-medium group-hover:underline">बॅक</span>
          </button>
          <div className="flex flex-col items-center mt-4">
            <div className="text-4xl mb-2">{section.icon}</div>
            <div className="text-2xl font-extrabold mb-4 text-gray-700">{section.title}</div>
            {section.info && section.info.length > 0 ? (
              <ul className="mt-4 space-y-2 w-full max-h-[60vh] overflow-auto pr-2">
                {section.info.map((item, idx) => (
                  <li
                    key={item}
                    className={
                      "rounded-lg px-4 py-2 bg-white/80 text-gray-900 font-semibold shadow " +
                      (hasImages
                        ? "hover:bg-green-100 hover:text-green-700 cursor-pointer transition duration-200"
                        : "hover:bg-blue-100 hover:text-blue-700 transition duration-200")
                    }
                    onClick={
                      hasImages
                        ? () =>
                          setShowImage({
                            title: item,
                            path: section.pdfMap[idx]?.imgPath,
                            content: section.pdfMap[idx]?.contant,
                          })
                        : undefined
                    }
                  >
                    {idx + 1}) {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 text-gray-700 italic">
                सदर शाखेसाठी तपशील लवकरच ...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 p-6">
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-white/90 hover:bg-blue-50 text-blue-700 rounded-lg px-4 py-2 shadow border border-blue-100 transition-all duration-200 group"
        >
          <BackIcon />
          <span className="text-base font-medium group-hover:underline">मागील पृष्ठ</span>
        </button>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-sm mb-6 flex items-center justify-center gap-2 animate-fadeIn">
          शाखा
        </h1>
        <div className="w-full flex flex-col gap-10">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-row gap-8 justify-center">
              {row.map((section, idx) => (
                <button
                  key={section.title}
                  className={`
                    group flex-1 max-w-xs px-6 py-10
                    rounded-3xl bg-gradient-to-br ${section.color}
                    flex flex-col items-center justify-center shadow-2xl border border-gray-200
                    text-gray-800 font-bold text-2xl transition-all duration-300
                    hover:scale-105 hover:-translate-y-2 hover:shadow-[0_4px_30px_rgba(0,0,0,0.18)]
                    outline-none focus:ring-4 focus:ring-blue-200
                  `}
                  onClick={() => setSelected(rowIdx * 3 + idx)}
                  tabIndex={0}
                  type="button"
                >
                  <div className="mb-4 text-5xl drop-shadow animate-pop">
                    {section.icon}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-2xl text-gray-900 group-hover:text-blue-700 transition">
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
      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform: translateY(20px);}
          to { opacity:1; transform: translateY(0);}
        }
        .animate-fadeIn { animation:fadeIn 0.8s cubic-bezier(.67,.21,.43,1.55);}
        @keyframes pop {
         0% { transform: scale(1);}
         60% { transform: scale(1.12);}
         100% { transform: scale(1);}
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(.61,-0.13,.54,1.23);}
      `}</style>
    </div>
  );
};

export default ShakhaGrid;
