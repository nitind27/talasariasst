"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ App Router

// Example image URLs
const images = [
  "/Slider/t1.jpg",
  "/Slider/t1.jpg",
  "/Slider/t1.jpg",
];

const SLIDE_INTERVAL = 5000; // auto-slide every 5 seconds

const navigationItems = [
  { label: "कार्यालय माहिती", icon: "🏢", href: "/karyalayamahiti" },
  { label: "शाखा", icon: "📂", href: "/shakha" },
  { label: "प्रश्नाउत्तरी", icon: "❓", href: "/questions" },
  { label: "महत्वाचे संपर्क", icon: "📞", href: "/mahatvache-sparsh" },
];

const FullPageImageSliderWithCard = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // State to track clicked button glow animation
  const [clickedIndex, setClickedIndex] = React.useState(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
      SLIDE_INTERVAL
    );
    return () => resetTimeout();
  }, [current]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (idx) => setCurrent(idx);

  // Handle click with glow animation then redirect
  const handleClick = (href, index) => {
    setClickedIndex(index);

    // Duration matches animation duration below (300ms)
    setTimeout(() => {
      setClickedIndex(null);
      router.push(href);
    }, 350);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-screen h-screen bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute top-1/2 w-full flex justify-between items-center z-20 px-6 pointer-events-none select-none">
        <button
          className="bg-black/30 text-white text-2xl rounded-full w-12 h-12 flex items-center justify-center shadow pointer-events-auto"
          onClick={() => setCurrent(current === 0 ? images.length - 1 : current - 1)}
          aria-label="Previous Slide"
        >
          &#8592;
        </button>
        <button
          className="bg-black/30 text-white text-2xl rounded-full w-12 h-12 flex items-center justify-center shadow pointer-events-auto"
          onClick={() => setCurrent(current === images.length - 1 ? 0 : current + 1)}
          aria-label="Next Slide"
        >
          &#8594;
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-12 w-full flex justify-center z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`mx-2 rounded-full w-4 h-4 ${
              i === current ? "bg-white" : "bg-white/50"
            } shadow-md border-2 border-white transition-colors`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating Card */}
      <div className="absolute left-0 right-0 bottom-24 z-30 pointer-events-none p-6">
        <div className="pointer-events-auto w-full px-0 sm:px-8 md:px-32">
          <div className="bg-custom-color backdrop-blur-lg w-full rounded-2xl shadow-2xl px-4 sm:px-12 py-8 mx-auto border border-gray-200">
            <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
              {navigationItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  tabIndex={0}
                  onClick={() => handleClick(item.href, i)}
                  className={`group bg-white shadow-xl rounded-xl h-24 w-24 sm:h-28 sm:w-28 flex flex-col items-center justify-center text-center text-gray-800 font-semibold transition-all duration-300 border-2 border-white hover:border-blue-500 hover:-translate-y-2 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 hover:shadow-2xl hover:text-blue-700 focus:outline-none
                    ${
                      clickedIndex === i
                        ? "animate-glow-click"
                        : ""
                    }
                  `}
                  aria-label={item.label}
                >
                  <span className="text-3xl mb-2 group-hover:animate-bounce">{item.icon}</span>
                  <span className="text-xs sm:text-base leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glow Click Animation - Tailwind does not have glow animations by default, so add this custom style inline */}
      <style>{`
        @keyframes glow-click {
          0% {
            box-shadow: 0 0 0px rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.7);
          }
          100% {
            box-shadow: 0 0 0px rgba(59, 130, 246, 0);
          }
        }
        .animate-glow-click {
          animation: glow-click 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default FullPageImageSliderWithCard;
