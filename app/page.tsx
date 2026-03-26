"use client";

import { useState } from "react";
import { Todo } from "./types";
import { DEMO_TODOS } from "./data";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import StatsBar from "./components/StatsBar";
import CalendarView from "./components/CalendarView";

type View = "list" | "calendar";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(DEMO_TODOS);
  const [view, setView] = useState<View>("list");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);

  function addTodo(data: Omit<Todo, "id" | "createdAt">) {
    const todo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTodos((prev) => [todo, ...prev]);
    setShowForm(false);
  }

  function updateTodo(data: Omit<Todo, "id" | "createdAt">) {
    if (!editing) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t))
    );
    setEditing(null);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-full bg-gray-50 font-sans">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === "calendar" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Calendar
              </button>
            </div>
            {!showForm && !editing && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Task
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsBar todos={todos} />
        </div>

        {/* Add/Edit form */}
        {(showForm || editing) && (
          <div className="mb-6">
            <TodoForm
              onSubmit={editing ? updateTodo : addTodo}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              initial={editing ?? undefined}
            />
          </div>
        )}

        {/* Views */}
        {view === "list" ? (
          <div className="flex flex-col gap-3">
            {todos.length === 0 ? (
              <p className="py-12 text-center text-gray-400">No tasks yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={(t) => {
                    setEditing(t);
                    setShowForm(false);
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <CalendarView
            todos={todos}
            onEdit={(t) => {
              setEditing(t);
              setShowForm(false);
            }}
            onToggle={toggleTodo}
          />
        )}
      </div>
    </div>
  );
}
