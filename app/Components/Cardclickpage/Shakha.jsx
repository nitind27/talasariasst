"use client";
import React, { useState } from "react";

// Schemes for "संगायो शाखा" (with PDFs)
const sangayoSchemes = [
  {
    name: "संजय गांधी निराधार अनदान योजना",
    pdfPath: "/pdf/SGY MAHITI.pdf",
  },
  {
    name: "श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना",
    pdfPath: "/pdf/SBY MAHITI.pdf",
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय वृध्दापकाळ निवृत्तीवेतन योजना",
    pdfPath: "/pdf/IGNOAPS MAHITI.pdf",
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना",
    pdfPath: "/pdf/IGNWPS MAHITI.pdf",
  },
  {
    name: "इंदिरा गांधी राष्ट्रीय दिव्यांग निवृत्तीवेतन योजना",
    pdfPath: "/pdf/IGNDPS MAHITI.pdf",
  },
  {
    name: "राष्ट्रीय कुटुंब अर्थसहाय्य लाभ योजना",
    pdfPath: "/pdfs/NFBS MAHITI.pdf",
  },
];

// Puravatha (“पुरवठा शाखा”) items & PDFs
const puravathaList = [
  {
    name: "विभक्त शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/1.pdf",
  },
  {
    name: "दुय्यम शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/.pdf",
  },
  {
    name: "शिधापत्रिकेत नाव समाविष्ट करण्यासाठी लागणारी आवश्यक कागदपत्",
    pdfPath: "/Pdf/purvath/3.pdf",
  },
  {
    name: "नवीन शिधापत्रिका काढण्यासाठी लागणारी आवश्यक कागदपत्र",
    pdfPath: "/Pdf/purvatha/4.pdf",
  },
  {
    name: "शिधापत्रिकेतून नाव काढण्यासाठी लागणारी आवश्यक कागदपत्",
    pdfPath: "/Pdf/purvatha/5.pdf",
  },
];

// All main sections
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
    pdfMap: sangayoSchemes, // Reference for PDF opening
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

// Back button SVG
const BackIcon = () => (
  <svg className="h-7 w-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

// Full-screen PDF Viewer 
const PDFViewerFull = ({ onBack, src, title }) => (
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
    </div>
    <div className="flex-1 w-full flex items-center justify-center">
      <iframe
        title={title + " PDF"}
        src={src}
        className="w-full h-full border-none"
      />
    </div>
  </div>
);

const ShakhaGrid = () => {
  const [selected, setSelected] = useState(null); // Index in sections
  const [showPdf, setShowPdf] = useState(null); // {title, path} or null

  // Split sections into 3 per row
  const rows = [];
  for (let i = 0; i < sections.length; i += 3) {
    rows.push(sections.slice(i, i + 3));
  }

  // Modal showing detail of any branch: for those with PDF list, clicking item opens full PDF
  const DetailCard = ({ section, onBack }) => {
    // Branches with PDFs per info item:
    const pdfSections = ["संगायो शाखा", "पुरवठा शाखा"];
    const hasPdfs = pdfSections.includes(section.title) && section.pdfMap;

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
              <ul className="mt-4 space-y-2 w-full">
                {section.info.map((item, idx) => (
                  <li
                    key={item}
                    className={
                      "rounded-lg px-4 py-2 bg-white/80 text-gray-900 font-semibold shadow " +
                      (hasPdfs
                        ? "hover:bg-green-100 hover:text-green-700 cursor-pointer transition duration-200"
                        : "hover:bg-blue-100 hover:text-blue-700 transition duration-200")
                    }
                    onClick={
                      hasPdfs
                        ? () => setShowPdf({ title: item, path: section.pdfMap[idx]?.pdfPath })
                        : undefined
                    }
                  >
                    {idx + 1}) {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 text-gray-700 italic">सदर शाखेसाठी तपशील लवकरच ...</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 p-6">
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
                  <div className="mb-4 text-5xl drop-shadow animate-pop">{section.icon}</div>
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
        <DetailCard
          section={sections[selected]}
          onBack={() => setSelected(null)}
        />
      )}
      {showPdf && (
        <PDFViewerFull
          src={showPdf.path}
          title={showPdf.title}
          onBack={() => setShowPdf(null)}
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
