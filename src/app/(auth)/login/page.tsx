"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/tasks";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-bold">AI Platform</h1>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" required
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre" required
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <button type="submit" className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground">
          Entrar
        </button>
      </form>
    </div>
  );
}
