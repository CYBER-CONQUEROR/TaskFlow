"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  CheckSquare2,
  FolderKanban,
  ListTodo,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const previewTodos = [
  {
    title: "Submit internship assignment",
    category: "Urgent",
    color: "#ef4444",
    completed: false,
  },
  {
    title: "Complete Laravel API",
    category: "Work",
    color: "#3b82f6",
    completed: true,
  },
  {
    title: "Study Next.js App Router",
    category: "Study",
    color: "#eab308",
    completed: false,
  },
  {
    title: "Go to the gym",
    category: "Health",
    color: "#22c55e",
    completed: false,
  },
];

const features = [
  {
    title: "Powerful Todo Management",
    description:
      "Create, edit, complete, search and filter your tasks from one clean dashboard.",
    icon: ListTodo,
  },
  {
    title: "Colorful Categories",
    description:
      "Create custom categories with unique colors and identify important work instantly.",
    icon: FolderKanban,
  },
  {
    title: "Track Your Progress",
    description:
      "See pending tasks, completed work and your overall completion percentage.",
    icon: TrendingUp,
  },
  {
    title: "Secure Authentication",
    description:
      "Your account and tasks are protected using Laravel Sanctum authentication.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(localStorage.getItem("token")));
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#090909] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[-180px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute right-[-140px] top-[340px] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-blue-600/5 blur-[150px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#090909]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.35)]">
              <CheckSquare2 className="h-6 w-6" />
            </div>

            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#categories"
              className="text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {authenticated ? (
              <Link
                href="/todos"
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold shadow-[0_8px_25px_rgba(99,102,241,0.22)] transition hover:bg-indigo-400"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="rounded-xl border border-neutral-800 p-2.5 text-neutral-300 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-neutral-800 bg-[#101010] px-5 py-5 md:hidden">
            <div className="space-y-2">
              <MobileNavLink
                href="#features"
                label="Features"
                onClick={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                href="#categories"
                label="Categories"
                onClick={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                href="#about"
                label="About"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            <div className="mt-5 grid gap-3">
              {authenticated ? (
                <Link
                  href="/todos"
                  className="rounded-xl bg-indigo-500 px-5 py-3 text-center font-semibold"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border border-neutral-700 px-5 py-3 text-center font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-indigo-500 px-5 py-3 text-center font-semibold"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-5 pb-20 pt-32 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pt-28">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
            <Sparkles className="h-4 w-4" />
            A smarter way to manage your day
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Organize your work with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
              colorful clarity.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-400">
            Create Todos, organize them into custom color categories, find
            important work instantly and track your progress from one beautiful
            dashboard.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={authenticated ? "/todos" : "/register"}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold shadow-[0_12px_35px_rgba(99,102,241,0.26)] transition hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              {authenticated ? "Open Dashboard" : "Start Organizing"}
              <ArrowRight className="h-5 w-5" />
            </Link>

            {!authenticated && (
              <Link
                href="/login"
                className="flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/60 px-6 py-3.5 font-semibold text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800"
              >
                Login to Your Account
              </Link>
            )}
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-500">
            <HeroPoint label="Secure authentication" />
            <HeroPoint label="Responsive design" />
            <HeroPoint label="Custom categories" />
          </div>
        </div>

        <DashboardPreview />
      </section>

      <section
        id="features"
        className="relative border-y border-neutral-800/80 bg-[#0d0d0d] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            label="Everything you need"
            title="Built to keep your work under control"
            description="TaskFlow combines Todo management, custom categories and progress tracking inside a focused dark-mode experience."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-neutral-800 bg-[#151515] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-[#191919]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/20">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8"
      >
        <div>
          <SectionHeading
            align="left"
            label="Visual organization"
            title="Know what matters before reading the task"
            description="Create categories with your own names and colors. Every Todo receives a visual identity, making urgent, personal, study and work tasks instantly recognizable."
          />

          <div className="mt-8 space-y-4">
            <Benefit label="Create unlimited personal categories" />
            <Benefit label="Choose colors from presets or a custom picker" />
            <Benefit label="Filter your entire Todo list by category" />
            <Benefit label="Keep Todos when a category is deleted" />
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-[#141414] p-5 shadow-2xl sm:p-7">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
            <div>
              <p className="font-semibold">Your Categories</p>
              <p className="mt-1 text-sm text-neutral-500">
                Organize tasks using meaningful colors.
              </p>
            </div>

            <button className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold">
              Add Category
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <CategoryPreview
              name="Urgent"
              count={3}
              color="#ef4444"
              percentage={85}
            />
            <CategoryPreview
              name="Work"
              count={8}
              color="#3b82f6"
              percentage={64}
            />
            <CategoryPreview
              name="Study"
              count={5}
              color="#eab308"
              percentage={48}
            />
            <CategoryPreview
              name="Health"
              count={4}
              color="#22c55e"
              percentage={35}
            />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="border-y border-neutral-800 bg-[#0d0d0d] py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
              The technology
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              A real full-stack application.
            </h2>

            <p className="mt-5 leading-7 text-neutral-500">
              TaskFlow is powered by a modern frontend, a protected REST API and
              a relational PostgreSQL database.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TechnologyCard
              name="Next.js"
              description="Responsive App Router frontend"
              icon={<Zap />}
            />

            <TechnologyCard
              name="Laravel"
              description="REST API and secure authentication"
              icon={<ShieldCheck />}
            />

            <TechnologyCard
              name="PostgreSQL"
              description="Relational cloud database"
              icon={<FolderKanban />}
            />

            <TechnologyCard
              name="Tailwind CSS"
              description="Modern responsive styling"
              icon={<Sparkles />}
            />
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 via-[#171717] to-violet-500/10 p-8 text-center shadow-[0_30px_100px_rgba(99,102,241,0.12)] sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500">
            <CheckSquare2 className="h-8 w-8" />
          </div>

          <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to take control of your tasks?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">
            Create your free TaskFlow account, build your own categories and
            begin turning plans into completed work.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={authenticated ? "/todos" : "/register"}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold transition hover:bg-indigo-400"
            >
              {authenticated ? "Go to Dashboard" : "Create Free Account"}
              <ArrowRight className="h-5 w-5" />
            </Link>

            {!authenticated && (
              <Link
                href="/login"
                className="rounded-xl border border-neutral-700 bg-neutral-900/70 px-6 py-3.5 font-semibold transition hover:border-neutral-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
              <CheckSquare2 className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold">TaskFlow</p>
              <p className="text-xs text-neutral-600">
                Organize. Focus. Complete.
              </p>
            </div>
          </div>

          <p className="text-sm text-neutral-600">
            Built with Next.js, Laravel and PostgreSQL.
          </p>

          <div className="flex items-center gap-2 text-neutral-500">
            
            <span className="text-sm">© 2026 TaskFlow</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="absolute -inset-8 rounded-[50px] bg-indigo-500/10 blur-3xl" />

      <div className="landing-dashboard-float relative overflow-hidden rounded-3xl border border-neutral-700/80 bg-[#141414] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>

          <div className="flex h-8 w-36 items-center gap-2 rounded-full bg-neutral-900 px-3 text-xs text-neutral-600">
            <Search className="h-3.5 w-3.5" />
            Search Todos
          </div>

          <div className="h-8 w-8 rounded-full bg-indigo-500/30" />
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[150px_1fr]">
          <div className="hidden rounded-2xl border border-neutral-800 bg-[#101010] p-3 sm:block">
            <div className="mb-5 flex items-center gap-2 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500">
                <CheckSquare2 className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">TaskFlow</span>
            </div>

            <div className="space-y-2">
              <PreviewSidebarItem label="Dashboard" active />
              <PreviewSidebarItem label="Tasks" />
              <PreviewSidebarItem label="Categories" />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">Good morning, John.</p>
                <p className="mt-1 text-[11px] text-neutral-600">
                  Here is what needs your attention.
                </p>
              </div>

              <button className="rounded-lg bg-indigo-500 px-3 py-2 text-[11px] font-semibold">
                + Add Todo
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <PreviewStat value="12" label="Total" />
              <PreviewStat value="08" label="Pending" />
              <PreviewStat value="04" label="Done" />
            </div>

            <div className="mt-4 grid gap-2">
              {previewTodos.map((todo) => (
                <div
                  key={todo.title}
                  className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#191919] p-3"
                  style={{
                    boxShadow: `inset 3px 0 0 ${todo.color}`,
                  }}
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                    style={{
                      borderColor: todo.completed
                        ? todo.color
                        : "#525252",
                      backgroundColor: todo.completed
                        ? `${todo.color}25`
                        : "transparent",
                    }}
                  >
                    {todo.completed && (
                      <Check
                        className="h-3.5 w-3.5"
                        style={{ color: todo.color }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-medium ${
                        todo.completed
                          ? "text-neutral-600 line-through"
                          : "text-neutral-300"
                      }`}
                    >
                      {todo.title}
                    </p>

                    <p
                      className="mt-1 text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: todo.color }}
                    >
                      {todo.category}
                    </p>
                  </div>

                  <span className="text-[9px] text-neutral-600">
                    {todo.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="landing-category-float absolute -bottom-8 -left-5 hidden rounded-2xl border border-neutral-700 bg-[#191919] p-4 shadow-2xl sm:block">
        <p className="text-xs text-neutral-500">Categories</p>

        <div className="mt-3 flex items-center gap-3">
          {["#ef4444", "#3b82f6", "#eab308", "#22c55e"].map(
            (color) => (
              <span
                key={color}
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}70`,
                }}
              />
            ),
          )}
        </div>
      </div>

      <div className="landing-progress-float absolute -right-5 top-24 hidden rounded-2xl border border-neutral-700 bg-[#191919] p-4 shadow-2xl sm:block">
        <p className="text-xs text-neutral-500">Weekly progress</p>
        <p className="mt-2 text-2xl font-bold">72%</p>
        <div className="mt-3 h-1.5 w-24 rounded-full bg-neutral-800">
          <div className="h-full w-[72%] rounded-full bg-indigo-400" />
        </div>
      </div>
    </div>
  );
}

function HeroPoint({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
      {label}
    </span>
  );
}

function Benefit({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-neutral-300">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
        <Check className="h-4 w-4" />
      </span>
      {label}
    </div>
  );
}

function CategoryPreview({
  name,
  count,
  color,
  percentage,
}: {
  name: string;
  count: number;
  color: string;
  percentage: number;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#1a1a1a] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}66`,
            }}
          />

          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-neutral-600">{count} Todos</p>
          </div>
        </div>

        <span className="text-xs text-neutral-500">{percentage}%</span>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function TechnologyCard({
  name,
  description,
  icon,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-[#151515] p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <div>
        <p className="font-semibold">{name}</p>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

function PreviewStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#191919] p-3">
      <p className="text-lg font-bold">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-wider text-neutral-600">
        {label}
      </p>
    </div>
  );
}

function PreviewSidebarItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-[10px] ${
        active
          ? "bg-neutral-700 text-white"
          : "text-neutral-600"
      }`}
    >
      {label}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-xl"
      }
    >
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
        {label}
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 leading-7 text-neutral-500">{description}</p>
    </div>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-3 text-neutral-300 hover:bg-neutral-800"
    >
      {label}
    </a>
  );
}