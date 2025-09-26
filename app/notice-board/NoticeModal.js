"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function NoticeModal({
  initialNotices = [],
  idleMs = 15000,
  autoOpen = true,
  showLauncherButton = true,
  openOnMount = false,
  imageSlideMs = 4000,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [fetched, setFetched] = useState([]);
  const idleTimer = useRef(null);
  const imgTimer = useRef(null);
  const videoRef = useRef(null);

  // Fetch notices from API and normalize media: video first, then images
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/notices", { cache: "no-store" });
        const list = await r.json();
        if (!mounted) return;
        const now = new Date();
        const normalized = (list || [])
          .filter(n => (n.status ? true : false) && (!n.expiry || new Date(n.expiry) >= now))
          .map(n => {
            const images = Array.isArray(n.images) ? n.images : [];
            const media = [];
            if (n.video_url) media.push({ type: "video", url: n.video_url });
            for (const u of images) media.push({ type: "image", url: u });
            return { ...n, media };
          })
          .filter(n => n.media.length > 0);
        setFetched(normalized);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const notices = useMemo(() => {
    if (fetched.length) return fetched;
    // Fallback to initialNotices (images only)
    return (initialNotices || []).map(n => {
      const media = Array.isArray(n.media) && n.media.length
        ? n.media
        : (Array.isArray(n.images) ? n.images.map(u => ({ type: "image", url: u })) : []);
      return { ...n, media };
    });
  }, [fetched, initialNotices]);

  // Idle auto-open
  useEffect(() => {
    if (!autoOpen) return;

    const resetActivity = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!isOpen) setIsOpen(true);
      }, idleMs);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetActivity, { passive: true }));
    resetActivity();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach((ev) => window.removeEventListener(ev, resetActivity));
    };
  }, [idleMs, autoOpen, isOpen]);

  // Open on mount option
  useEffect(() => {
    if (openOnMount) setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = notices[activeNoticeIndex] || null;
  const media = current?.media || [];
  const at = media[slideIndex] || null;

  const nextSlide = () => setSlideIndex((i) => (i + 1) % Math.max(media.length || 1, 1));
  const prevSlide = () => setSlideIndex((i) => (i - 1 + Math.max(media.length || 1, 1)) % Math.max(media.length || 1, 1));
  useEffect(() => setSlideIndex(0), [activeNoticeIndex, isOpen]);

  // Images auto-advance
  useEffect(() => {
    if (!isOpen) return;
    if (!at || at.type !== "image") return;
    if (imgTimer.current) clearTimeout(imgTimer.current);
    imgTimer.current = setTimeout(() => {
      nextSlide();
    }, imageSlideMs);
    return () => {
      if (imgTimer.current) clearTimeout(imgTimer.current);
    };
  }, [isOpen, at, imageSlideMs]);

  // Video autoplay when active
  useEffect(() => {
    if (!isOpen) return;
    if (at?.type !== "video") return;
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    }
  }, [isOpen, at]);

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
                    {current ? (
                      <>
                        <div className="relative bg-gray-50 rounded-md">
                          <div className="w-full overflow-hidden flex items-center justify-center">
                            {at ? (
                              at.type === "video" ? (
                                <video
                                  key={at.url}
                                  ref={videoRef}
                                  src={at.url}
                                  className="h-[80vh] w-auto object-contain mx-auto bg-black"
                                  onEnded={nextSlide}
                                  muted
                                  autoPlay
                                  controls
                                />
                              ) : (
                                <img
                                  key={at.url}
                                  src={at.url}
                                  alt={`Slide ${slideIndex + 1}`}
                                  className="h-[80vh] w-auto object-contain mx-auto"
                                />
                              )
                            ) : (
                              <div className="text-sm text-gray-500 py-10">No media</div>
                            )}
                          </div>

                          {media.length > 1 && (
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
                                    className={`h-2.5 w-2.5 rounded-full ${i === slideIndex ? "bg-gray-900" : "bg-gray-300"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}

                          {at && (
                            <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-black/70 text-white">
                              {at.type === "video" ? "Video" : "Photo"} {slideIndex + 1}/{media.length || 1}
                            </div>
                          )}
                        </div>

                        <Dialog.Title className="mt-4 text-lg font-semibold text-center">
                          {current.title}
                        </Dialog.Title>

                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line max-h-80 overflow-auto pr-1">
                          {current.description}
                        </div>

                        {(current.pdf_url || current.pdfUrl) && (
                          <div className="mt-4 text-center">
                            <a href={current.pdf_url || current.pdfUrl} rel="noreferrer" className="underline text-gray-900">
                              View PDF
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">No active notices.</div>
                    )}
                  </div>

                  <div className="px-4 sm:px-6 py-3 border-t flex items-center justify-end">
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