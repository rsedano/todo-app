import { Todo } from "../types";

interface StatsBarDict {
  active: string;
  done: string;
  urgent: string;
}

const defaultDict: StatsBarDict = {
  active: "Active",
  done: "Done",
  urgent: "Urgent",
};

interface StatsBarProps {
  todos: Todo[];
  dict?: Partial<StatsBarDict>;
}

export default function StatsBar({ todos, dict }: StatsBarProps) {
  const t = { ...defaultDict, ...dict };
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  const active = total - done;
  const urgent = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="flex gap-6">
          <span className="text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{active}</span>{" "}
            {t.active}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{done}</span>{" "}
            {t.done}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{urgent}</span>{" "}
            {t.urgent}
          </span>
        </div>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
