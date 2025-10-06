"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ App Router
import "./home.css";
import NoticeModal from "../../notice-board/NoticeModal";

// Example image URLs
const images = [
  "/Slider/imgslider.jpeg",
  "/card/1.jpeg",
  "/card/2.jpeg",
  "/card/3.jpeg",
  "/card/4.jpeg",
  "/card/5.jpeg",
  "/card/6.jpeg",
  "/card/7.jpeg",
  "/card/8.jpeg",
  "/card/9.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.34 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.35 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.35 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.36 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.36 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.37 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.38 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.38 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM (2).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.40 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.40 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.41 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.41 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.42 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.42 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.43 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.43 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.44 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.44 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.45 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.45 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.46 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.46 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.47 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.47 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.48 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.48 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.49 PM.jpeg",
];

const SLIDE_INTERVAL = 5000; // auto-slide every 5 seconds

const navigationItems = [
  { label: "कार्यालय माहिती", icon: "🏢", href: "/karyalayamahiti" },
  { label: "शाखा", icon: "📂", href: "/shakha" },
  { label: "प्रश्नोत्तरे", icon: "❓", href: "/questions" },
  { label: "महत्वाचे संपर्क", icon: "📞", href: "/mahatvache-sparsh" },
  { label: "व्याख्या", icon: "💡", href: "/krushiyear" },
];

const FullPageImageSliderWithCard = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // State to track clicked button glow animation
  const [clickedIndex, setClickedIndex] = React.useState(null);

  // Notices state for modal
  const [notices, setNotices] = useState([]);
  const [modalReady, setModalReady] = useState(false);

  useEffect(() => {
    // fetch notices on mount and open modal immediately
    fetch("/api/notices", { cache: "no-store" })
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || []).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          images: r.images || [],
          pdfUrl: r.pdf_url,
          expiry: r.expiry,
        }));
        setNotices(mapped);
        setModalReady(true);
      })
      .catch(() => setModalReady(true));
  }, []);

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
    <div className="home-container">
      {/* Slides */}
      <div
        className="slides-container"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
                {images.map((img, idx) => (
          <div
            key={idx}
            className="slide"
            style={{ backgroundImage: `url("${img}")` }}
          />
        ))}
      </div>

      {/* Arrows */}
      {/* <div className="arrows-container">
        <button
          className="arrow-button"
          onClick={() => setCurrent(current === 0 ? images.length - 1 : current - 1)}
          aria-label="Previous Slide"
        >
          &#8592;
        </button>
        <button
          className="arrow-button"
          onClick={() => setCurrent(current === images.length - 1 ? 0 : current + 1)}
          aria-label="Next Slide"
        >
          &#8594;
        </button>
      </div> */}

      {/* Dots */}
      <div className="dots-container">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`dot-button ${i === current ? "active" : "inactive"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating Card */}
      <div className="floating-card-container">
        <div className="card-wrapper">
          <div className="main-card">
            <div className="nav-buttons-container">
              {navigationItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  tabIndex={0}
                  onClick={() => handleClick(item.href, i)}
                  className={`nav-button ${
                    clickedIndex === i ? "animate-glow-click" : ""
                  }`}
                  aria-label={item.label}
                >
                  <span className="button-icon">{item.icon}</span>
                  <span className="button-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Modal: open on mount with API-fed data */}
      {modalReady && (
        <div className="hidden">{/* keeps DOM neat; modal renders portal */}
          <NoticeModal initialNotices={notices} openOnMount={true} autoOpen={false} showLauncherButton={false} />
        </div>
      )}
    </div>
  );
};

export default FullPageImageSliderWithCard;
