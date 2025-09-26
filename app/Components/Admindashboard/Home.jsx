"use client";
import NoticeModal from "../../notice-board/NoticeModal";

export default function Home() {
  return (
    <div className="space-y-4">
      {/* ...existing dashboard content... */}
      <NoticeModal showLauncherButton={true} autoOpen={true} />
    </div>
  );
}