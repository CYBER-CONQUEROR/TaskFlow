"use client";

import api from "@/lib/api";
import axios from "axios";
import {
  CheckSquare2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user),
      );

      router.push("/todos");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        const firstError = errors
          ? Object.values(errors).flat()[0]
          : undefined;

        setError(
          String(
            firstError ??
              error.response?.data?.message ??
              "Registration failed.",
          ),
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.35)]">
              <CheckSquare2 className="h-6 w-6" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              TaskFlow
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-400 transition hover:bg-neutral-900 hover:text-white sm:px-5"
            >
              Home
            </Link>

            <Link
              href="/login"
              className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-900 hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-2.5 text-sm font-semibold text-indigo-200 sm:px-5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="auth-background flex min-h-screen items-center justify-center px-4 pb-12 pt-32">
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 shadow-[0_0_35px_rgba(99,102,241,0.18)]">
              <CheckSquare2 className="h-8 w-8 text-indigo-300" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-neutral-400">
              Organize your daily Todos with categories and colors.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-[#171717]/95 p-7 shadow-2xl backdrop-blur sm:p-9">
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthInput
                id="name"
                label="Full name"
                icon={<UserRound className="h-5 w-5" />}
                type="text"
                autoComplete="name"
                value={form.name}
                placeholder="John Wick"
                onChange={(value) =>
                  setForm({
                    ...form,
                    name: value,
                  })
                }
              />

              <AuthInput
                id="email"
                label="Email address"
                icon={<Mail className="h-5 w-5" />}
                type="email"
                autoComplete="email"
                value={form.email}
                placeholder="name@company.com"
                onChange={(value) =>
                  setForm({
                    ...form,
                    email: value,
                  })
                }
              />

              <PasswordInput
                id="password"
                label="Password"
                value={form.password}
                placeholder="Minimum 8 characters"
                show={showPassword}
                autoComplete="new-password"
                onToggle={() =>
                  setShowPassword((value) => !value)
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    password: value,
                  })
                }
              />

              <PasswordInput
                id="password-confirmation"
                label="Confirm password"
                value={form.password_confirmation}
                placeholder="Repeat your password"
                show={showConfirmation}
                autoComplete="new-password"
                onToggle={() =>
                  setShowConfirmation((value) => !value)
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    password_confirmation: value,
                  })
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 font-semibold text-white shadow-[0_8px_25px_rgba(99,102,241,0.25)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                )}

                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>
            </form>
          </div>

          <p className="mt-7 text-center text-sm text-neutral-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function AuthInput({
  id,
  label,
  icon,
  type,
  autoComplete,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  autoComplete: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-200"
      >
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
          {icon}
        </span>

        <input
          id={id}
          required
          type={type}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 w-full rounded-xl border border-neutral-700 bg-[#0e0e0e] pl-12 pr-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  label,
  value,
  placeholder,
  show,
  autoComplete,
  onToggle,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  show: boolean;
  autoComplete: string;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-200"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />

        <input
          id={id}
          required
          minLength={8}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 w-full rounded-xl border border-neutral-700 bg-[#0e0e0e] pl-12 pr-12 text-white outline-none transition placeholder:text-neutral-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />

        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-white"
        >
          {show ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}