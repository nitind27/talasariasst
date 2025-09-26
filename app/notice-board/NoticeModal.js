"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function NoticeModal({
  initialNotices = [
    {
      id: 1,
      title: "Public Notice",
      description: "Important update for all users.",
      images: ["/pdfimage/1.jpg", "/pdfimage/2.jpg", "/pdfimage/3.jpg"],
      pdfUrl: "/Pdf/IGNDPS MAHITI.pdf",
      expiry: "2099-12-31",
    },
  ],
  idleMs = 15000,
  autoOpen = true,
  showLauncherButton = true,
  openOnMount = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const idleTimer = useRef(null);

  const notices = useMemo(
    () => initialNotices.filter((n) => !n.expiry || new Date(n.expiry) >= new Date()),
    [initialNotices]
  );

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

  // Open immediately on mount when requested
  useEffect(() => {
    if (openOnMount) setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = notices[activeNoticeIndex] || null;
  const images = current?.images || [];

  const nextSlide = () => setSlideIndex((i) => (i + 1) % Math.max(images.length, 1));
  const prevSlide = () => setSlideIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  useEffect(() => setSlideIndex(0), [activeNoticeIndex, isOpen]);

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
                   
                  {/* Single column layout: Image centered, then title, then description */}
                  <div className="p-0 sm:p-0">
                    {current ? (
                      <>
                        {/* Image slider on top */}
                        <div className="relative bg-gray-50 rounded-md">
                          <div className=" w-full overflow-hidden flex items-center justify-center">
                            {images.length > 0 ? (
                              <img
                                key={images[slideIndex]}
                                src={images[slideIndex]}
                                alt={`Slide ${slideIndex + 1}`}
                                className="h-[80vh] w-auto object-cover mx-auto"
                              />
                            ) : (
                              <div className="text-sm text-gray-500 py-10">No images</div>
                            )}
                          </div>

                          {images.length > 1 && (
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
                                {images.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setSlideIndex(i)}
                                    className={`h-2.5 w-2.5 rounded-full ${i === slideIndex ? "bg-gray-900" : "bg-gray-300"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <Dialog.Title className="mt-4 text-lg font-semibold text-center">
                          {current.title}
                        </Dialog.Title>

                        {/* Description */}
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line max-h-80 overflow-auto pr-1">
                          {current.description}
                        </div>

                        {/* Optional PDF link */}
                        {current.pdfUrl && (
                          <div className="mt-4 text-center">
                            <a
                              href={current.pdfUrl}
                              // target="_blank"
                              rel="noreferrer"
                              className="underline text-gray-900"
                            >
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