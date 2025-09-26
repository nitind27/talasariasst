"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      username: form.get("username"),
      password: form.get("password"),
    };
    const r = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (r.ok) {
      // auto login
      const r2 = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: body.username,
          password: body.password,
        }),
      });
      if (r2.ok) router.replace(next);
      else router.replace("/login?next=" + encodeURIComponent(next));
    } else {
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign up to access the Admin Panel.
        </p>

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a
            href={`/login?next=${encodeURIComponent(next)}`}
            className="underline text-blue-700"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading signup...</div>}>
      <SignupForm />
    </Suspense>
  );
}
