"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function NoticeModal({
  initialNotices = [],
  idleMs = 15000,
  autoOpen = true,
  showLauncherButton = true,
  openOnMount = false,
  imageSlideMs = 5000, // 5 seconds interval
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [fetched, setFetched] = useState([]);

  const idleTimer = useRef(null);
  const autoSlideTimer = useRef(null);

  // Fetch notices from API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/notices", { cache: "no-store" });
        const list = await res.json();
        if (!mounted) return;

        const now = new Date();
        const normalized = (list || [])
          .filter(n => n.status && (!n.expiry || new Date(n.expiry) >= now))
          .map(n => {
            const images = Array.isArray(n.images) ? n.images : [];
            const media = images.map(url => ({ type: "image", url }));
            return { ...n, media };
          })
          .filter(n => n.media.length > 0);

        setFetched(normalized);
      } catch (e) {
        console.error("Failed to fetch notices:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Use fetched notices or initial
  const notices = useMemo(() => {
    if (fetched.length) return fetched;
    return (initialNotices || []).map(n => {
      const images = Array.isArray(n.images) ? n.images : [];
      const media = images.map(url => ({ type: "image", url }));
      return { ...n, media };
    });
  }, [fetched, initialNotices]);

  const currentNotice = notices[activeNoticeIndex] || null;
  const media = currentNotice?.media || [];
  const currentImage = media[slideIndex] || null;

  // Reset slide index when notice or modal changes
  useEffect(() => {
    setSlideIndex(0);
  }, [activeNoticeIndex, isOpen]);

  // Auto slide images and notices every imageSlideMs milliseconds
  useEffect(() => {
    if (!isOpen || notices.length === 0) return;

    autoSlideTimer.current = setTimeout(() => {
      if (slideIndex < media.length - 1) {
        // Go to next image in current notice
        setSlideIndex(slideIndex + 1);
      } else {
        // Go to next notice and reset slide index
        setActiveNoticeIndex((activeNoticeIndex + 1) % notices.length);
        setSlideIndex(0);
      }
    }, imageSlideMs);

    return () => clearTimeout(autoSlideTimer.current);
  }, [slideIndex, activeNoticeIndex, isOpen, imageSlideMs, media.length, notices.length]);

  // Auto-open modal on idle user
  useEffect(() => {
    if (!autoOpen) return;

    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!isOpen) setIsOpen(true);
      }, idleMs);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(idleTimer.current);
      events.forEach(ev => window.removeEventListener(ev, reset));
    };
  }, [autoOpen, idleMs, isOpen]);

  // Open modal on mount if flag is set
  useEffect(() => {
    if (openOnMount) setIsOpen(true);
  }, [openOnMount]);

  // Navigation functions for user manual controls
  const nextSlide = () => {
    if (media.length === 0) return;
    if (slideIndex < media.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setActiveNoticeIndex((activeNoticeIndex + 1) % notices.length);
      setSlideIndex(0);
    }
  };

  const prevSlide = () => {
    if (media.length === 0) return;
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else {
      const prevNoticeIndex = (activeNoticeIndex - 1 + notices.length) % notices.length;
      setActiveNoticeIndex(prevNoticeIndex);
      setSlideIndex(notices[prevNoticeIndex]?.media.length - 1 || 0);
    }
  };

  return (
    <>
      {showLauncherButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800"
        >
          Notice Board
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-5xl">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
                  <div className="p-0 sm:p-0">
                    {currentNotice ? (
                      <>
                        <div className="relative bg-gray-50 rounded-md">
                          <div className="w-full overflow-hidden flex items-center justify-center">
                            {currentImage ? (
                              <img
                                key={currentImage.url}
                                src={currentImage.url}
                                alt={`Slide ${slideIndex + 1}`}
                                className="h-[80vh] w-auto object-contain mx-auto"
                              />
                            ) : (
                              <div className="text-sm text-gray-500 py-10">No media</div>
                            )}
                          </div>

                          {(media.length > 1 || notices.length > 1) && (
                            <>
                              <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -translate-y-1/2 left-3 p-2 rounded-full bg-white shadow hover:bg-gray-50"
                                aria-label="Previous"
                              >
                                <FiChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-full bg-white shadow hover:bg-gray-50"
                                aria-label="Next"
                              >
                                <FiChevronRight className="h-5 w-5" />
                              </button>

                              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
                                {media.map((m, i) => (
                                  <button
                                    key={m.url + i}
                                    onClick={() => setSlideIndex(i)}
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      i === slideIndex ? "bg-gray-900" : "bg-gray-300"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}

                          {currentImage && (
                            <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-black/70 text-white">
                              Image {slideIndex + 1}/{media.length}
                            </div>
                          )}
                        </div>

                        <Dialog.Title className="mt-4 text-lg font-semibold text-center">
                          {currentNotice.title}
                        </Dialog.Title>

                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line max-h-80 overflow-auto pr-1 px-4">
                          {currentNotice.description}
                        </div>

                        {(currentNotice.pdf_url || currentNotice.pdfUrl) && (
                          <div className="mt-4 text-center">
                            <a
                              href={currentNotice.pdf_url || currentNotice.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-gray-900"
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 px-4 py-8 text-center">No active notices.</div>
                    )}
                  </div>

                  <div className="px-4 sm:px-6 py-3 border-t flex items-center justify-between">
                    {/* <div className="flex gap-2">
                      {notices.map((notice, index) => (
                        <button
                          key={notice.id}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            index === activeNoticeIndex ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                          onClick={() => {
                            setActiveNoticeIndex(index);
                            setSlideIndex(0);
                          }}
                          aria-label={`Show notice ${index + 1}`}
                        >
                          {notice.title || `Notice ${index + 1}`}
                        </button>
                      ))}
                    </div> */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
