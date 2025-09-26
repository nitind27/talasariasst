"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiHome, FiBell, FiSettings, FiLogOut, FiUser } from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/notice-board", label: "Notice Board", icon: FiBell },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(j => setUser(j.user || null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?next=/admin";
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar (blue) */}
      <header className="sticky top-0 z-40 bg-blue-600 text-white">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((s) => !s)}
              className="lg:hidden p-2 rounded-md bg-blue-500/40 hover:bg-blue-500/60 border border-white/20"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/40">
                <FiUser className="h-4 w-4" />
                <span className="text-sm">{user.name || user.username}</span>
              </div>
            ) : null}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-blue-700 hover:bg-gray-100 text-sm"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed sidebar */}
      <aside
        className={`fixed z-40 top-16 bottom-0 left-0 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="h-full overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                  ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <main className="pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:pl-80">
        <div className="min-h-[70vh]">{children}</div>
        <footer className="py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Your Organization. All rights reserved.
        </footer>
      </main>
    </div>
  );
}