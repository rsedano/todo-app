"use client";

import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors: Record<Todo["priority"], string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const categoryColors: Record<Todo["category"], string> = {
  work: "bg-purple-100 text-purple-700",
  personal: "bg-green-100 text-green-700",
  shopping: "bg-orange-100 text-orange-700",
  health: "bg-teal-100 text-teal-700",
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${todo.completed ? "opacity-60" : ""} ${isOverdue ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-base font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
            {todo.title}
          </span>
          {isOverdue && (
            <span className="text-xs font-semibold text-red-600 uppercase">Overdue</span>
          )}
        </div>
        {todo.description && (
          <p className="text-sm text-gray-500 mb-2">{todo.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${categoryColors[todo.category]}`}>
            {todo.category}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onToggle(todo.id)}
          className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          {todo.completed ? "Mark as incomplete" : "Mark as complete"}
        </button>
        <button
          onClick={() => onEdit(todo)}
          className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
