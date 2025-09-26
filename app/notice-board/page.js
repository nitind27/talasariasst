// app/notice-board/page.js
"use client";
import { useEffect, useState } from "react";
import NoticeModal from "./NoticeModal";

export default function Page() {
  const [notices, setNotices] = useState([]);
  useEffect(() => {
    fetch("/api/notices", { cache: "no-store" })
      .then(r => r.json())
      .then(rows => setNotices(rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        images: r.images || [],
        pdfUrl: r.pdf_url,
        expiry: r.expiry,
      }))));
  }, []);
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-xl font-semibold mb-4">User Notice Board</h1>
      <NoticeModal initialNotices={notices} />
    </div>
  );
}