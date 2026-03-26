import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../components/TodoItem";
import { Todo } from "../types";

const baseTodo: Todo = {
  id: "1",
  title: "Write tests",
  description: "Cover the main components",
  completed: false,
  priority: "high",
  category: "work",
  createdAt: new Date("2026-03-25"),
  dueDate: new Date("2026-03-30"),
};

describe("TodoItem", () => {
  it("renders the todo title", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("Cover the main components")).toBeInTheDocument();
  });

  it("renders priority and category badges", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("work")).toBeInTheDocument();
  });

  it("calls onToggle with the todo id when checkbox is clicked", async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /mark as complete/i }));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("calls onDelete with the todo id when delete button is clicked", async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("calls onEdit with the todo when edit button is clicked", async () => {
    const onEdit = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(baseTodo);
  });

  it("shows 'Mark as incomplete' label when todo is completed", () => {
    const completed = { ...baseTodo, completed: true };
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /mark as incomplete/i })).toBeInTheDocument();
  });

  it("marks overdue todos", () => {
    const overdue = { ...baseTodo, dueDate: new Date("2020-01-01") };
    render(<TodoItem todo={overdue} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it("does not mark completed todos as overdue even if past due date", () => {
    const done = { ...baseTodo, completed: true, dueDate: new Date("2020-01-01") };
    render(<TodoItem todo={done} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
  });
});
