"use client";

import { Todo } from "../types";

interface StatsBarProps {
  todos: Todo[];
}

export default function StatsBar({ todos }: StatsBarProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Overall progress</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">{pct}%</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{active}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
        </div>
        <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{completed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
        </div>
        <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
          <p className="text-xl font-bold text-red-500 dark:text-red-400">{highPriority}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Urgent</p>
        </div>
      </div>
    </div>
  );
}
