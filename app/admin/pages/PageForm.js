"use client";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

export default function PageForm() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [migrating, setMigrating] = useState(false);

  async function load() {
    const r = await fetch("/api/pages", { cache: "no-store" });
    setItems(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function migrateImages() {
    if (!confirm("This will copy all default images from public folder to tem/pages and add them to database. Continue?")) {
      return;
    }
    setMigrating(true);
    try {
      const res = await fetch("/api/pages/migrate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        await load();
        Swal.fire({
          icon: "success",
          title: "Migration successful",
          text: `${data.imagesCount} images migrated successfully`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({ icon: "error", title: "Migration failed", text: data.error || "Please try again" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Migration failed", text: error.message });
    } finally {
      setMigrating(false);
    }
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  }

  function removeImagePreview(id) {
    setImagePreviews((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  }

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const [draggedItem] = newPreviews.splice(draggedIndex, 1);
      newPreviews.splice(dropIndex, 0, draggedItem);
      return newPreviews;
    });

    setDraggedIndex(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    
    const imageOrder = [];
    imagePreviews.forEach((preview, index) => {
      if (preview.file) {
        form.append("images", preview.file);
        imageOrder.push({ type: "new", index: form.getAll("images").length - 1 });
      } else if (preview.isExisting && preview.url) {
        form.append("existingImages", preview.url);
        imageOrder.push({ type: "existing", index: form.getAll("existingImages").length - 1 });
      }
    });

    form.append("imageOrder", JSON.stringify(imageOrder));

    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/pages/${editing}` : "/api/pages";

    const res = await fetch(url, { method, body: form });
    setLoading(false);

    if (res.ok) {
      formEl.reset();
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.preview));
      setImagePreviews([]);
      const isEdit = Boolean(editing);
      setEditing(null);
      await load();

      Swal.fire({
        icon: "success",
        title: isEdit ? "Page updated" : "Page created",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      const err = await res.json().catch(() => ({}));
      Swal.fire({ icon: "error", title: "Failed", text: err.error || "Please try again" });
    }
  }

  function startEdit(p) {
    setEditing(p.id);

    const existingImages = (p.images || []).map((url, idx) => ({
      file: null,
      preview: url,
      id: `existing-${idx}-${Date.now()}`,
      isExisting: true,
      url: url,
    }));
    setImagePreviews(existingImages);
  }

  async function deleteRow(id) {
    if (!confirm("Delete this page?")) return;
    const r = await fetch(`/api/pages/${id}`, { method: "DELETE" });
    if (r.ok) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: "error", title: "Delete failed" });
    }
  }

  async function toggleStatus(p) {
    const next = p.status ? 0 : 1;
    const r = await fetch(`/api/pages/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (r.ok) {
      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    } else {
      Swal.fire({ icon: "error", title: "Failed to update status" });
    }
  }

  function openViewer(images, i = 0) {
    setViewerList(images || []);
    setViewerIndex(i);
    setViewerOpen(true);
  }

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => {
        if (p.preview && !p.isExisting) {
          URL.revokeObjectURL(p.preview);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Migration Button */}
      {items.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Migrate Default Images</h3>
              <p className="text-xs text-blue-700 mt-1">Copy existing images from public folder to database</p>
            </div>
            <button
              onClick={migrateImages}
              disabled={migrating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {migrating ? "Migrating..." : "Migrate Images"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{editing ? "Edit Page" : "Create Page"}</h2>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                const form = document.getElementById("page-form");
                if (form) form.reset();
                imagePreviews.forEach((p) => {
                  if (p.preview && !p.isExisting) URL.revokeObjectURL(p.preview);
                });
                setImagePreviews([]);
              }}
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        <form id="page-form" onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Images (Multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm hover:file:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select multiple images. Drag and drop to reorder them.
              </p>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative group border-2 border-dashed rounded-lg overflow-hidden ${
                        draggedIndex === index ? "border-blue-500 opacity-50" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImagePreview(preview.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : editing ? "Update Page" : "Save Page"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">All Pages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Images</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {p.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-1 flex-wrap">
                      {(p.images || []).map((u, i) => (
                        <button
                          key={i}
                          onClick={() => openViewer(p.images || [], i)}
                          className="focus:outline-none"
                        >
                          <img src={u} alt="" className="h-8 w-8 rounded object-cover border" />
                        </button>
                      ))}
                      {(!p.images || p.images.length === 0) && <span>-</span>}
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(p.id)}
                        className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`px-2 py-1 rounded ${
                          p.status
                            ? "bg-yellow-600 text-white hover:bg-yellow-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {p.status ? "Deactive" : "Active"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            className="absolute top-3 right-3 text-white text-xl z-10"
            onClick={() => setViewerOpen(false)}
          >
            ✕
          </button>
          {viewerList.length > 0 ? (
            <div className="max-w-5xl w-full px-4">
              <div className="relative">
                <img
                  src={viewerList[viewerIndex]}
                  alt=""
                  className="w-full max-h-[80vh] object-contain rounded"
                />
                {viewerList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setViewerIndex((i) => (i - 1 + viewerList.length) % viewerList.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl px-2 bg-black/50 rounded hover:bg-black/70"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setViewerIndex((i) => (i + 1) % viewerList.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl px-2 bg-black/50 rounded hover:bg-black/70"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              <div className="mt-3 flex justify-center gap-2">
                {viewerList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setViewerIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ${i === viewerIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-md px-4 py-3 text-sm shadow">Saving...</div>
        </div>
      )}
    </div>
  );
}
