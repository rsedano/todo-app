"use client";

import { useState } from "react";
import { Todo } from "../types";
import { DEMO_TODOS } from "../data";
import { Dictionary } from "../[lang]/dictionaries";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import StatsBar from "./StatsBar";

interface TodoAppProps {
  dict: Dictionary;
}

export default function TodoApp({ dict }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(DEMO_TODOS);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  function handleAdd(data: Omit<Todo, "id" | "createdAt">) {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setShowForm(false);
  }

  function handleEdit(data: Omit<Todo, "id" | "createdAt">) {
    if (!editingTodo) return;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === editingTodo.id ? { ...t, ...data } : t
      )
    );
    setEditingTodo(null);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const formDict = {
    titlePlaceholder: dict.form.titlePlaceholder,
    descriptionPlaceholder: dict.form.descriptionPlaceholder,
    addButton: dict.form.addButton,
    saveButton: dict.form.saveButton,
    cancelButton: dict.form.cancelButton,
  };

  const itemDict = {
    markComplete: dict.todo.markComplete,
    markIncomplete: dict.todo.markIncomplete,
    edit: dict.todo.edit,
    delete: dict.todo.delete,
    overdue: dict.todo.overdue,
  };

  const statsDict = {
    active: dict.stats.active,
    done: dict.stats.done,
    urgent: dict.stats.urgent,
  };

  return (
    <div className="flex flex-col gap-6">
      <StatsBar todos={todos} dict={statsDict} />

      {editingTodo ? (
        <div className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-600">
          <TodoForm
            onSubmit={handleEdit}
            onCancel={() => setEditingTodo(null)}
            initial={editingTodo}
            dict={formDict}
          />
        </div>
      ) : showForm ? (
        <div className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-600">
          <TodoForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} dict={formDict} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg border-2 border-dashed border-zinc-300 py-3 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-600 dark:hover:border-zinc-500"
        >
          + {dict.page.addButton}
        </button>
      )}

      <div className="flex flex-col gap-3">
        {todos.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-8">{dict.page.noTodos}</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={setEditingTodo}
              dict={itemDict}
            />
          ))
        )}
      </div>
    </div>
  );
}
