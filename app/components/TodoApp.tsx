"use client";

import { useState, useMemo } from "react";
import { Todo, Priority, Category } from "../types";
import { DEMO_TODOS } from "../data";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import FilterBar, { FilterStatus } from "./FilterBar";
import StatsBar from "./StatsBar";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(DEMO_TODOS);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
          !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
      if (status === "active" && t.completed) return false;
      if (status === "completed" && !t.completed) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (category !== "all" && t.category !== category) return false;
      return true;
    });
  }, [todos, search, status, priority, category]);

  function addTodo(data: Omit<Todo, "id" | "createdAt">) {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setShowForm(false);
  }

  function updateTodo(data: Omit<Todo, "id" | "createdAt">) {
    if (!editingTodo) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === editingTodo.id ? { ...t, ...data } : t))
    );
    setEditingTodo(null);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My Todos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay organised and get things done.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsBar todos={todos} />
        </div>

        {/* Add button / form */}
        <div className="mb-6">
          {showForm ? (
            <div className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">New Todo</h2>
              <TodoForm onSubmit={addTodo} onCancel={() => setShowForm(false)} />
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 py-3 text-sm font-medium text-indigo-500 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add new todo
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-5">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            category={category}
            onCategoryChange={setCategory}
            onClearCompleted={clearCompleted}
            completedCount={completedCount}
          />
        </div>

        {/* Todo list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No todos found</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">Try adjusting your filters or add a new todo.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={(t) => setEditingTodo(t)}
              />
            ))}
          </div>
        )}

        {/* Edit modal */}
        {editingTodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Edit Todo</h2>
              <TodoForm
                onSubmit={updateTodo}
                onCancel={() => setEditingTodo(null)}
                initial={editingTodo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
