"use client";

import { Todo } from "../types";

interface StatsBarProps {
  todos: Todo[];
}

export default function StatsBar({ todos }: StatsBarProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const urgent = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Progress</span>
        <span className="font-semibold text-blue-600">{pct}%</span>
      </div>
      <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-900">{active}</span>
          <span className="text-gray-500">Active</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-900">{completed}</span>
          <span className="text-gray-500">Done</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-red-600">{urgent}</span>
          <span className="text-gray-500">Urgent</span>
        </div>
      </div>
    </div>
  );
}
