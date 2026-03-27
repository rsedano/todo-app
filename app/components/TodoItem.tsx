"use client";

import { Todo } from "../types";

interface TodoItemDict {
  markComplete: string;
  markIncomplete: string;
  edit: string;
  delete: string;
  overdue: string;
}

const defaultDict: TodoItemDict = {
  markComplete: "Mark as complete",
  markIncomplete: "Mark as incomplete",
  edit: "Edit",
  delete: "Delete",
  overdue: "Overdue",
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  dict?: Partial<TodoItemDict>;
}

const priorityColors: Record<Todo["priority"], string> = {
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const categoryColors: Record<Todo["category"], string> = {
  work: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  shopping: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  health: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit, dict }: TodoItemProps) {
  const t = { ...defaultDict, ...dict };
  const isOverdue =
    !todo.completed && todo.dueDate !== undefined && new Date(todo.dueDate) < new Date();

  return (
    <div
      className={`rounded-lg border p-4 transition-opacity ${
        todo.completed
          ? "border-zinc-200 opacity-60 dark:border-zinc-700"
          : "border-zinc-300 dark:border-zinc-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={todo.completed ? t.markIncomplete : t.markComplete}
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors ${
            todo.completed
              ? "border-zinc-400 bg-zinc-400 dark:border-zinc-500 dark:bg-zinc-500"
              : "border-zinc-400 hover:border-zinc-600 dark:border-zinc-500"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium ${
              todo.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{todo.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${priorityColors[todo.priority]}`}
            >
              {todo.priority}
            </span>
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${categoryColors[todo.category]}`}
            >
              {todo.category}
            </span>
            {isOverdue && (
              <span className="inline-block rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {t.overdue}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            aria-label={t.edit}
            onClick={() => onEdit(todo)}
            className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {t.edit}
          </button>
          <button
            type="button"
            aria-label={t.delete}
            onClick={() => onDelete(todo.id)}
            className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
