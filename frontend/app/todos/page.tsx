"use client";

import api from "@/lib/api";
import axios from "axios";
import {
  Check,
  CheckCircle2,
  CheckSquare2,
  ChevronDown,
  CirclePlus,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LoaderCircle,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type Category = {
  id: number;
  name: string;
  color: string;
  todos_count?: number;
};

type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  category_id: number | null;
  category: Category | null;
  created_at: string;
  updated_at: string;
};

type TodoForm = {
  title: string;
  description: string;
  category_id: string;
  completed: boolean;
};

type CategoryForm = {
  name: string;
  color: string;
};

const initialTodoForm: TodoForm = {
  title: "",
  description: "",
  category_id: "",
  completed: false,
};

const initialCategoryForm: CategoryForm = {
  name: "",
  color: "#6366f1",
};

const colorPresets = [
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
];

export default function TodosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingTodo, setSavingTodo] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [period, setPeriod] = useState("today");
  const [selectedCreatedDate, setSelectedCreatedDate] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [todoForm, setTodoForm] =
    useState<TodoForm>(initialTodoForm);

  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(initialCategoryForm);

  const fetchCategories = useCallback(async () => {
    const response = await api.get("/categories");
    setCategories(response.data.categories);
  }, []);

  const fetchTodos = useCallback(async () => {
    const parameters: Record<string, string> = {};

    if (search.trim()) {
      parameters.search = search.trim();
    }

    if (period !== "custom") {
      parameters.period = period;
    }

    if (period === "custom" && selectedCreatedDate) {
      parameters.created_date = selectedCreatedDate;
    }

    if (status !== "all") {
      parameters.status = status;
    }

    if (categoryFilter !== "all") {
      if (categoryFilter === "uncategorized") {
        parameters.uncategorized = "true";
      } else {
        parameters.category_id = categoryFilter;
      }
    }

    const response = await api.get("/todos", {
      params: parameters,
    });

    setTodos(response.data.todos);
  }, [
    search,
    status,
    categoryFilter,
    period,
    selectedCreatedDate,
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    async function loadDashboard() {
      try {
        setLoading(true);

        await Promise.all([
          fetchTodos(),
          fetchCategories(),
        ]);
      } catch (error: unknown) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        setError("Could not load your TaskFlow dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [fetchCategories, fetchTodos, router]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!loading) {
        fetchTodos().catch(() => {
          setError("Could not refresh the Todo list.");
        });
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [search, status, categoryFilter, fetchTodos, loading]);

  const statistics = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const percentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      pending,
      percentage,
    };
  }, [todos]);

  function openCreateTodo() {
    setEditingTodo(null);
    setTodoForm(initialTodoForm);
    setTodoModalOpen(true);
  }

  function openEditTodo(todo: Todo) {
    setEditingTodo(todo);

    setTodoForm({
      title: todo.title,
      description: todo.description ?? "",
      category_id: todo.category_id
        ? String(todo.category_id)
        : "",
      completed: todo.completed,
    });

    setTodoModalOpen(true);
  }

  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryForm(initialCategoryForm);
    setCategoryModalOpen(true);
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);

    setCategoryForm({
      name: category.name,
      color: category.color,
    });

    setCategoryModalOpen(true);
  }

  async function saveTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSavingTodo(true);

    const payload = {
      title: todoForm.title,
      description: todoForm.description || null,
      category_id: todoForm.category_id
        ? Number(todoForm.category_id)
        : null,
      completed: todoForm.completed,
    };

    try {
      if (editingTodo) {
        await api.patch(`/todos/${editingTodo.id}`, payload);
      } else {
        await api.post("/todos", payload);
      }

      setTodoModalOpen(false);
      setTodoForm(initialTodoForm);

      await Promise.all([
        fetchTodos(),
        fetchCategories(),
      ]);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Could not save the Todo."));
    } finally {
      setSavingTodo(false);
    }
  }

  async function saveCategory(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSavingCategory(true);

    try {
      if (editingCategory) {
        await api.patch(
          `/categories/${editingCategory.id}`,
          categoryForm,
        );
      } else {
        await api.post("/categories", categoryForm);
      }

      setCategoryModalOpen(false);
      setCategoryForm(initialCategoryForm);

      await Promise.all([
        fetchCategories(),
        fetchTodos(),
      ]);
    } catch (error: unknown) {
      setError(
        getErrorMessage(error, "Could not save the category."),
      );
    } finally {
      setSavingCategory(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    try {
      await api.patch(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });

      await fetchTodos();
    } catch {
      setError("Could not update the Todo status.");
    }
  }

  async function deleteTodo(todo: Todo) {
    const confirmed = window.confirm(
      `Delete "${todo.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/todos/${todo.id}`);

      await Promise.all([
        fetchTodos(),
        fetchCategories(),
      ]);
    } catch {
      setError("Could not delete the Todo.");
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Delete category "${category.name}"? Its Todos will become uncategorized.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${category.id}`);

      if (categoryFilter === String(category.id)) {
        setCategoryFilter("all");
      }

      await Promise.all([
        fetchCategories(),
        fetchTodos(),
      ]);
    } catch {
      setError("Could not delete the category.");
    }
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // Remove the local credentials even if the API request fails.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-neutral-800 bg-[#171717] transition-transform lg:translate-x-0 ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <CheckSquare2 className="h-6 w-6" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              TaskFlow
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-neutral-400 lg:hidden"
          >
            <X />
          </button>
        </div>

        <nav className="space-y-2 px-4 py-4">
          <SidebarButton
            active
            icon={<LayoutDashboard />}
            label="Dashboard"
          />

          <SidebarButton
            icon={<ListTodo />}
            label="Tasks"
            onClick={() => setCategoryPanelOpen(false)}
          />

          <SidebarButton
            icon={<FolderKanban />}
            label="Categories"
            onClick={() => setCategoryPanelOpen(true)}
          />
        </nav>

        <div className="mt-auto border-t border-neutral-800 p-4">
          <button
            onClick={logout}
            className="mb-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>

          <div className="flex items-center gap-3 rounded-2xl bg-[#202020] p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/20 font-semibold text-indigo-200">
              {getInitials(user?.name ?? "User")}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name ?? "User"}
              </p>

              <p className="truncate text-xs text-neutral-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-neutral-800 bg-[#0d0d0d]/90 px-4 backdrop-blur md:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-neutral-800 p-2 text-neutral-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden w-[340px] md:block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Quick search..."
                className="h-11 w-full rounded-full border border-neutral-700 bg-[#111] pl-12 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <button
            onClick={openCreateTodo}
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.2)] transition hover:bg-indigo-400"
          >
            <Plus className="h-5 w-5" />
            Add Todo
          </button>
        </header>

        <div className="mx-auto max-w-[1450px] p-4 md:p-7">
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <span>{error}</span>

              <button onClick={() => setError("")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <section className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Good {getDayPart()}, {firstName(user?.name)}.
            </h1>

            <p className="mt-3 text-neutral-400">
              Small progress every day adds up to big results.
            </p>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Todos"
              value={statistics.total}
              label="All tasks"
              icon={<ListTodo />}
            />

            <StatCard
              title="Pending"
              value={statistics.pending}
              label="In progress"
              icon={<CirclePlus />}
              accent="#ffb783"
            />

            <StatCard
              title="Completed"
              value={statistics.completed}
              label="Well done"
              icon={<CheckCircle2 />}
              accent="#c0c1ff"
            />

            <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-300">
                  Completion
                </p>

                <p className="text-2xl font-bold">
                  {statistics.percentage}%
                </p>
              </div>

              <div className="mt-7 h-2 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-indigo-400 transition-all"
                  style={{
                    width: `${statistics.percentage}%`,
                  }}
                />
              </div>
            </div>
          </section>

          <section className="mb-7">
            <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  ["all", "All Todos"],
                  ["pending", "Pending"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setStatus(value)}
                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${status === value
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative md:hidden">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search Todos..."
                    className="h-11 w-full rounded-xl border border-neutral-700 bg-[#111] pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <select
                    value={period}
                    onChange={(event) => {
                      const value = event.target.value;

                      setPeriod(value);

                      if (value !== "custom") {
                        setSelectedCreatedDate("");
                      }
                    }}
                    className="h-11 w-full appearance-none rounded-xl border border-neutral-700 bg-[#111] pl-4 pr-11 text-sm outline-none focus:border-indigo-500 sm:w-[190px]"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this-week">This Week</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="older">Older Tasks</option>
                    <option value="custom">Choose a Date</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>{period === "custom" && (
                  <input
                    type="date"
                    value={selectedCreatedDate}
                    max={getLocalDateString()}
                    onChange={(event) =>
                      setSelectedCreatedDate(event.target.value)
                    }
                    className="h-11 rounded-xl border border-neutral-700 bg-[#111] px-4 text-sm outline-none focus:border-indigo-500"
                  />
                )}


                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-neutral-700 bg-[#111] pl-4 pr-11 text-sm outline-none focus:border-indigo-500 sm:w-[210px]"
                  >
                    <option value="all">All categories</option>
                    <option value="uncategorized">
                      Uncategorized
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>

                <button
                  onClick={() =>
                    setCategoryPanelOpen((value) => !value)
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-[#111] px-4 text-sm font-semibold transition hover:border-neutral-500"
                >
                  <Tag className="h-4 w-4" />
                  Manage Categories
                </button>
              </div>
            </div>
          </section>

          {categoryPanelOpen && (
            <CategoryPanel
              categories={categories}
              onCreate={openCreateCategory}
              onEdit={openEditCategory}
              onDelete={deleteCategory}
            />
          )}

          {todos.length === 0 ? (
            <EmptyTodos onCreate={openCreateTodo} />
          ) : (
            <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={openEditTodo}
                  onDelete={deleteTodo}
                />
              ))}

              <button
                onClick={openCreateTodo}
                className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-600 bg-[#101010] text-neutral-400 transition hover:border-indigo-400 hover:bg-indigo-500/5 hover:text-indigo-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800">
                  <Plus />
                </div>

                <span className="font-semibold">
                  Create New Todo
                </span>
              </button>
            </section>
          )}
        </div>
      </section>

      {todoModalOpen && (
        <TodoModal
          editingTodo={editingTodo}
          form={todoForm}
          categories={categories}
          saving={savingTodo}
          onChange={setTodoForm}
          onClose={() => setTodoModalOpen(false)}
          onSubmit={saveTodo}
          onCreateCategory={() => {
            setTodoModalOpen(false);
            openCreateCategory();
          }}
        />
      )}

      {categoryModalOpen && (
        <CategoryModal
          editingCategory={editingCategory}
          form={categoryForm}
          saving={savingCategory}
          onChange={setCategoryForm}
          onClose={() => setCategoryModalOpen(false)}
          onSubmit={saveCategory}
        />
      )}
    </main>
  );
}

function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}) {
  const color = todo.category?.color ?? "#737373";

  return (
    <article
      className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#171717] p-6 transition hover:-translate-y-0.5 hover:border-neutral-600"
      style={{
        boxShadow: `inset 3px 0 0 ${color}`,
      }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo)}
          aria-label="Toggle Todo status"
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition"
          style={{
            borderColor: todo.completed ? color : "#525252",
            backgroundColor: todo.completed
              ? `${color}30`
              : "transparent",
          }}
        >
          {todo.completed && (
            <Check className="h-4 w-4" style={{ color }} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h2
            className={`text-xl font-semibold leading-snug ${todo.completed
              ? "text-neutral-500 line-through"
              : "text-neutral-100"
              }`}
          >
            {todo.title}
          </h2>

          {todo.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
              {todo.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
              style={{
                borderColor: `${color}55`,
                backgroundColor: `${color}16`,
                color,
              }}
            >
              {todo.category?.name ?? "Uncategorized"}
            </span>

            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <CalendarDays className="h-4 w-4" />

              <span>{formatCreatedDate(todo.created_at)}</span>
            </div>

            <span className="text-xs text-neutral-600">
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 flex gap-2 opacity-70 transition group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={() => onDelete(todo)}
          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function CategoryPanel({
  categories,
  onCreate,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  onCreate: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-neutral-800 bg-[#141414] p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Your categories
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Create colored groups to organize your work.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-400"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700 p-8 text-center text-neutral-500">
          You have not created any categories yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#1b1b1b] p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{
                    backgroundColor: category.color,
                    boxShadow: `0 0 16px ${category.color}66`,
                  }}
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {category.name}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {category.todos_count ?? 0} Todos
                  </p>
                </div>
              </div>

              <div className="flex">
                <button
                  onClick={() => onEdit(category)}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onDelete(category)}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TodoModal({
  editingTodo,
  form,
  categories,
  saving,
  onChange,
  onClose,
  onSubmit,
  onCreateCategory,
}: {
  editingTodo: Todo | null;
  form: TodoForm;
  categories: Category[];
  saving: boolean;
  onChange: (form: TodoForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCreateCategory: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
            {editingTodo ? "Edit task" : "New task"}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {editingTodo ? "Update Todo" : "Create New Todo"}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
        >
          <X />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <FormField label="Todo title">
          <input
            required
            value={form.title}
            placeholder="What needs to be done?"
            onChange={(event) =>
              onChange({
                ...form,
                title: event.target.value,
              })
            }
            className="h-12 w-full rounded-xl border border-neutral-700 bg-[#101010] px-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            rows={4}
            value={form.description}
            placeholder="Add optional details..."
            onChange={(event) =>
              onChange({
                ...form,
                description: event.target.value,
              })
            }
            className="w-full resize-none rounded-xl border border-neutral-700 bg-[#101010] px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </FormField>

        <FormField label="Category">
          <select
            value={form.category_id}
            onChange={(event) =>
              onChange({
                ...form,
                category_id: event.target.value,
              })
            }
            className="h-12 w-full rounded-xl border border-neutral-700 bg-[#101010] px-4 outline-none focus:border-indigo-500"
          >
            <option value="">Uncategorized</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onCreateCategory}
            className="mt-3 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
          >
            + Create a new category
          </button>
        </FormField>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#101010] p-4">
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(event) =>
              onChange({
                ...form,
                completed: event.target.checked,
              })
            }
            className="h-5 w-5 accent-indigo-500"
          />

          <span>
            <span className="block font-semibold">
              Mark as completed
            </span>

            <span className="text-sm text-neutral-500">
              You can change this later.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-neutral-700 px-5 font-semibold text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {saving && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}

            {saving
              ? "Saving..."
              : editingTodo
                ? "Save Changes"
                : "Create Todo"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function CategoryModal({
  editingCategory,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}: {
  editingCategory: Category | null;
  form: CategoryForm;
  saving: boolean;
  onChange: (form: CategoryForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
            Category
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {editingCategory
              ? "Edit Category"
              : "Create Category"}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
        >
          <X />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <FormField label="Category name">
          <input
            required
            maxLength={50}
            value={form.name}
            placeholder="Example: Urgent"
            onChange={(event) =>
              onChange({
                ...form,
                name: event.target.value,
              })
            }
            className="h-12 w-full rounded-xl border border-neutral-700 bg-[#101010] px-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </FormField>

        <FormField label="Category color">
          <div className="grid grid-cols-5 gap-3">
            {colorPresets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  onChange({
                    ...form,
                    color,
                  })
                }
                className={`flex h-11 items-center justify-center rounded-xl border transition ${form.color === color
                  ? "border-white"
                  : "border-transparent"
                  }`}
                style={{
                  backgroundColor: `${color}25`,
                }}
              >
                <span
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: color }}
                />

                {form.color === color && (
                  <Check className="ml-2 h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#101010] p-3">
            <input
              type="color"
              value={form.color}
              onChange={(event) =>
                onChange({
                  ...form,
                  color: event.target.value,
                })
              }
              className="h-10 w-12 cursor-pointer border-0 bg-transparent"
            />

            <span className="font-mono text-sm text-neutral-400">
              {form.color}
            </span>
          </div>
        </FormField>

        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: `${form.color}55`,
            backgroundColor: `${form.color}12`,
          }}
        >
          <p className="text-sm text-neutral-400">Preview</p>

          <div className="mt-2 flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: form.color }}
            />

            <span
              className="font-semibold"
              style={{ color: form.color }}
            >
              {form.name || "Category name"}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-neutral-700 px-5 font-semibold text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 font-semibold hover:bg-indigo-400 disabled:opacity-60"
          >
            {saving && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}

            {saving
              ? "Saving..."
              : editingCategory
                ? "Save Changes"
                : "Create Category"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-[580px] overflow-y-auto rounded-t-3xl border border-neutral-700 bg-[#1b1b1b] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-300">
        {label}
      </label>

      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number;
  label: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-neutral-800 bg-[#171717] p-6"
      style={{
        boxShadow: accent
          ? `inset 3px 0 0 ${accent}`
          : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-400">
          {title}
        </p>

        <span className="text-neutral-600">{icon}</span>
      </div>

      <div className="mt-5 flex items-end gap-3">
        <strong className="text-4xl tracking-tight">
          {String(value).padStart(2, "0")}
        </strong>

        <span
          className="mb-1 text-sm"
          style={{
            color: accent ?? "#a5b4fc",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function SidebarButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${active
        ? "bg-neutral-700 text-white"
        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
    >
      <span className="[&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      {label}
    </button>
  );
}

function EmptyTodos({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-3xl border border-dashed border-neutral-700 bg-[#111] px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
        <ListTodo className="h-8 w-8" />
      </div>

      <h2 className="mt-6 text-2xl font-bold">
        No Todos found
      </h2>

      <p className="mx-auto mt-3 max-w-md text-neutral-500">
        Create a Todo, change your filters, or search for
        something else.
      </p>

      <button
        onClick={onCreate}
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400"
      >
        <Plus className="h-5 w-5" />
        Create Todo
      </button>
    </section>
  );
}

function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909]">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15">
          <LoaderCircle className="h-8 w-8 animate-spin text-indigo-300" />
        </div>

        <p className="mt-5 font-semibold">
          Loading TaskFlow...
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          Preparing your tasks and categories.
        </p>
      </div>
    </main>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const errors = error.response?.data?.errors;
  const firstError = errors
    ? Object.values(errors).flat()[0]
    : undefined;

  return String(
    firstError ?? error.response?.data?.message ?? fallback,
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function firstName(name?: string): string {
  return name?.split(" ")[0] ?? "User";
}

function getDayPart(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "morning";
  }

  if (hour < 18) {
    return "afternoon";
  }

  return "evening";
}

function getLocalDateString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

function formatCreatedDate(date: string): string {
  const created = new Date(date);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (isSameCalendarDay(created, today)) {
    return `Created today at ${created.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (isSameCalendarDay(created, yesterday)) {
    return `Created yesterday at ${created.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return `Created ${created.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
}

function isSameCalendarDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}