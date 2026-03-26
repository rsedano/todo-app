"use client";

import { useState } from "react";
import { Todo } from "../types";

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, "id" | "createdAt">) => void;
  onCancel: () => void;
  initial?: Todo;
}

export default function TodoForm({ onSubmit, onCancel, initial }: TodoFormProps) {
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
      priority,
      category,
      completed: initial?.completed ?? false,
      dueDate: initial?.dueDate,
    });
  }

  const isEdit = Boolean(initial);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <div className="flex gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Todo["priority"])}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Todo["category"])}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {isEdit ? "Save Changes" : "Add Todo"}
        </button>
      </div>
    </form>
  );
}
