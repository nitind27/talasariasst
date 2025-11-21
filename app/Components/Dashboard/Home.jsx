"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ App Router
import "./home.css";
import NoticeModal from "../../notice-board/NoticeModal";

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
  const [images, setImages] = useState([]); // Dynamic images from API

  // Fetch pages (slider images) from API
  useEffect(() => {
    fetch("/api/pages", { cache: "no-store" })
      .then((r) => r.json())
      .then((pages) => {
        // Filter active pages and extract all images
        const activePages = pages.filter(p => p.status === 1);
        const allImages = [];
        
        activePages.forEach((page) => {
          if (page.images && Array.isArray(page.images)) {
            allImages.push(...page.images);
          }
        });
        
        // Set images - use API images if available, otherwise fallback
        if (allImages.length > 0) {
          setImages(allImages);
        } else {
          // Fallback to default images
          setImages([
            "/Slider/imgslider.jpeg",
            "/card/1.jpeg",
          ]);
        }
      })
      .catch((err) => {
        console.error("Error fetching pages:", err);
        // Fallback to default images on error
        setImages([
          "/Slider/imgslider.jpeg",
          "/card/1.jpeg",
        ]);
      });
  }, []);

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
    if (images.length === 0) return;
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
      SLIDE_INTERVAL
    );
    return () => resetTimeout();
  }, [current, images.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (idx) => setCurrent(idx);

  const handleClick = (href, index) => {
    setClickedIndex(index);
    setTimeout(() => {
      setClickedIndex(null);
      router.push(href);
    }, 350);
  };

  return (
    <div className="home-container">
      {/* Slides */}
      {images.length > 0 && (
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
      )}

      {/* Dots */}
      {images.length > 0 && (
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
      )}

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

      {/* Notice Modal */}
      {modalReady && (
        <div className="hidden">
          <NoticeModal initialNotices={notices} openOnMount={true} autoOpen={false} showLauncherButton={false} />
        </div>
      )}
    </div>
  );
};

export default FullPageImageSliderWithCard;
