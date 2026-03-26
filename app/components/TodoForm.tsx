"use client";

import { useState } from "react";
import { Todo } from "../types";

interface TodoFormDict {
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  addButton: string;
  saveButton: string;
  cancelButton: string;
}

const defaultDict: TodoFormDict = {
  titlePlaceholder: "What needs to be done?",
  descriptionPlaceholder: "Description (optional)",
  addButton: "Add Todo",
  saveButton: "Save Changes",
  cancelButton: "Cancel",
};

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, "id" | "createdAt">) => void;
  onCancel: () => void;
  initial?: Todo;
  dict?: Partial<TodoFormDict>;
}

export default function TodoForm({ onSubmit, onCancel, initial, dict }: TodoFormProps) {
  const t = { ...defaultDict, ...dict };
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Todo["priority"]>(initial?.priority ?? "medium");
  const [category, setCategory] = useState<Todo["category"]>(initial?.category ?? "personal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({
      title: trimmed,
      description: description.trim() || undefined,
      completed: initial?.completed ?? false,
      priority,
      category,
      dueDate: initial?.dueDate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t.titlePlaceholder}
        className="rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t.descriptionPlaceholder}
        className="rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Todo["priority"])}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Todo["category"])}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {initial ? t.saveButton : t.addButton}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          {t.cancelButton}
        </button>
      </div>
    </form>
  );
}
