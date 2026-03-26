"use client";

import { useState } from "react";
import { Todo } from "../types";

interface CalendarViewProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onToggle: (id: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const priorityDot: Record<Todo["priority"], string> = {
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-red-500",
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarView({ todos, onEdit, onToggle }: CalendarViewProps) {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    setCurrent(new Date(year, month - 1, 1));
    setSelected(null);
  }

  function nextMonth() {
    setCurrent(new Date(year, month + 1, 1));
    setSelected(null);
  }

  function todosForDay(day: number) {
    const date = new Date(year, month, day);
    return todos.filter((t) => t.dueDate && sameDay(new Date(t.dueDate), date));
  }

  const selectedTodos = selected
    ? todos.filter((t) => t.dueDate && sameDay(new Date(t.dueDate), selected))
    : [];

  // Build grid cells: empty leading cells + day cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded p-1 text-gray-600 hover:bg-gray-100"
          aria-label="Previous month"
        >
          &#8249;
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="rounded p-1 text-gray-600 hover:bg-gray-100"
          aria-label="Next month"
        >
          &#8250;
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {DAYS.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="bg-gray-50 min-h-16" />;
          }
          const date = new Date(year, month, day);
          const isToday = sameDay(date, today);
          const isSelected = selected && sameDay(date, selected);
          const dayTodos = todosForDay(day);

          return (
            <button
              key={day}
              onClick={() => setSelected(isSelected ? null : date)}
              className={`min-h-16 bg-white p-1 text-left hover:bg-blue-50 transition-colors ${isSelected ? "ring-2 ring-inset ring-blue-500" : ""}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                  isToday ? "bg-blue-600 text-white" : "text-gray-700"
                }`}
              >
                {day}
              </span>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayTodos.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className={`h-1.5 w-1.5 rounded-full ${priorityDot[t.priority]} ${t.completed ? "opacity-40" : ""}`}
                  />
                ))}
                {dayTodos.length > 3 && (
                  <span className="text-xs text-gray-400">+{dayTodos.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day tasks */}
      {selected && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            {selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {selectedTodos.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks due on this day.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-start justify-between gap-2 rounded border p-2 ${
                    todo.completed ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${priorityDot[todo.priority]}`}
                    />
                    <div className="min-w-0">
                      <span className={`block text-sm font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span className="block truncate text-xs text-gray-500">{todo.description}</span>
                      )}
                      <span className="text-xs text-gray-400 capitalize">{todo.category} · {todo.priority} priority</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => onToggle(todo.id)}
                      className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100"
                    >
                      {todo.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      onClick={() => onEdit(todo)}
                      className="rounded px-1.5 py-0.5 text-xs text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="font-medium">Priority:</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />High</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400" />Medium</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" />Low</span>
      </div>
    </div>
  );
}
