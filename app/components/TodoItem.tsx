"use client";

import { Todo, Priority, Category } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const CATEGORY_STYLES: Record<Category, string> = {
  work: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  shopping: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  health: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all ${
        todo.completed
          ? "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/40"
          : "border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          todo.completed
            ? "border-indigo-500 bg-indigo-500"
            : "border-gray-300 hover:border-indigo-400 dark:border-gray-600"
        }`}
      >
        {todo.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-medium ${
              todo.completed ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {todo.title}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[todo.priority]}`}>
            {todo.priority}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[todo.category]}`}>
            {todo.category}
          </span>
        </div>

        {todo.description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{todo.description}</p>
        )}

        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span>Created {formatDate(new Date(todo.createdAt))}</span>
          {todo.dueDate && (
            <span className={isOverdue ? "font-medium text-red-500" : ""}>
              Due {formatDate(new Date(todo.dueDate))}
              {isOverdue && " (overdue)"}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          aria-label="Edit todo"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
