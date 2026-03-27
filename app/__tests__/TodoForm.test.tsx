import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "../components/TodoForm";
import { Todo } from "../types";

describe("TodoForm — add mode", () => {
  it("renders the title input and submit button", () => {
    render(<TodoForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add todo/i })).toBeInTheDocument();
  });

  it("does not call onSubmit when title is empty", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct data on valid submit", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "Buy milk");
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    const arg = onSubmit.mock.calls[0][0];
    expect(arg.title).toBe("Buy milk");
    expect(arg.completed).toBe(false);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    render(<TodoForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("trims whitespace from title before submitting", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "  Clean desk  ");
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit.mock.calls[0][0].title).toBe("Clean desk");
  });
});

describe("TodoForm — field interactions", () => {
  it("updates description field on input", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText(/description/i), "Some notes");
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "Task");
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit.mock.calls[0][0].description).toBe("Some notes");
  });

  it("submits selected priority", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.selectOptions(screen.getByDisplayValue("Medium"), "high");
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "Task");
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit.mock.calls[0][0].priority).toBe("high");
  });

  it("submits selected category", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.selectOptions(screen.getByDisplayValue("Personal"), "work");
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "Task");
    await userEvent.click(screen.getByRole("button", { name: /add todo/i }));
    expect(onSubmit.mock.calls[0][0].category).toBe("work");
  });
});

describe("TodoForm — edit mode", () => {
  const existing: Todo = {
    id: "99",
    title: "Existing task",
    description: "Some detail",
    completed: false,
    priority: "low",
    category: "personal",
    createdAt: new Date("2026-03-01"),
  };

  it("pre-fills the form with the existing todo's values", () => {
    render(<TodoForm onSubmit={vi.fn()} onCancel={vi.fn()} initial={existing} />);
    expect(screen.getByDisplayValue("Existing task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Some detail")).toBeInTheDocument();
  });

  it("renders 'Save Changes' button in edit mode", () => {
    render(<TodoForm onSubmit={vi.fn()} onCancel={vi.fn()} initial={existing} />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("submits updated title", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} initial={existing} />);
    const input = screen.getByDisplayValue("Existing task");
    await userEvent.clear(input);
    await userEvent.type(input, "Updated task");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(onSubmit.mock.calls[0][0].title).toBe("Updated task");
  });
});
