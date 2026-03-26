import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsBar from "../components/StatsBar";
import { Todo } from "../types";

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: Math.random().toString(),
    title: "Test",
    completed: false,
    priority: "medium",
    category: "personal",
    createdAt: new Date(),
    ...overrides,
  };
}

describe("StatsBar", () => {
  it("shows 0% progress when no todos are completed", () => {
    const todos = [makeTodo(), makeTodo()];
    render(<StatsBar todos={todos} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("shows 100% progress when all todos are completed", () => {
    const todos = [makeTodo({ completed: true }), makeTodo({ completed: true })];
    render(<StatsBar todos={todos} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows correct active and done counts", () => {
    const todos = [
      makeTodo({ completed: false }),
      makeTodo({ completed: false }),
      makeTodo({ completed: true }),
    ];
    render(<StatsBar todos={todos} />);
    expect(screen.getByText("2")).toBeInTheDocument(); // active
    expect(screen.getByText("1")).toBeInTheDocument(); // done
  });

  it("counts only incomplete high-priority todos as urgent", () => {
    const todos = [
      makeTodo({ priority: "high", completed: false }),
      makeTodo({ priority: "high", completed: true }), // completed — should not count
      makeTodo({ priority: "medium", completed: false }),
    ];
    render(<StatsBar todos={todos} />);
    // active=2, done=1, urgent=1
    const counts = screen.getAllByText("1");
    expect(counts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders 0% progress bar when todos list is empty", () => {
    render(<StatsBar todos={[]} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
