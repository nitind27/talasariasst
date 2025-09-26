import NoticeForm from "./notice-board/NoticeForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Notice Board</h1>
      <NoticeForm />
    </div>
  );
}