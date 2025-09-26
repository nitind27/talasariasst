"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.user) router.replace(next);
      });
  }, [next, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      username: form.get("username"),
      password: form.get("password"),
    };
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (r.ok) {
      await Swal.fire({
        icon: "success",
        title: "Logged in",
        timer: 900,
        showConfirmButton: false,
      });
      router.replace(next || "/admin");
      router.refresh();
    } else {
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">
          Log in to access the Admin Panel.
        </p>

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-sm mt-4 text-center">
          New here?{" "}
          <a
            href={`/signup?next=${encodeURIComponent(next)}`}
            className="underline text-blue-700"
          >
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
