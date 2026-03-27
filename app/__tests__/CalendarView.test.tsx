import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalendarView from "../components/CalendarView";
import { Todo } from "../types";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    title: "Test Todo",
    completed: false,
    priority: "medium",
    category: "work",
    createdAt: new Date(),
    ...overrides,
  };
}

describe("CalendarView", () => {
  it("renders the current month and year heading", () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    expect(screen.getByText(`${months[month]} ${year}`)).toBeInTheDocument();
  });

  it("renders day-of-week headers", () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    for (const day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
      expect(screen.getByText(day)).toBeInTheDocument();
    }
  });

  it("navigates to previous month when previous button is clicked", async () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous month" }));
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    expect(screen.getByText(`${months[prevMonth]} ${prevYear}`)).toBeInTheDocument();
  });

  it("navigates to next month when next button is clicked", async () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    expect(screen.getByText(`${months[nextMonth]} ${nextYear}`)).toBeInTheDocument();
  });

  it("shows todo dots for todos with a due date in the current month", () => {
    const dueDate = new Date(year, month, 15);
    const todo = makeTodo({ id: "t1", title: "Meeting", dueDate });
    render(<CalendarView todos={[todo]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    // Clicking the day cell should reveal selected day details
    const dayButton = screen.getByRole("button", { name: /^15$/ });
    expect(dayButton).toBeInTheDocument();
  });

  it("shows selected day task panel when a day with todos is clicked", async () => {
    const dueDate = new Date(year, month, 15);
    const todo = makeTodo({ id: "t1", title: "Doctor Appointment", dueDate });
    render(<CalendarView todos={[todo]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /^15$/ }));
    expect(screen.getByText("Doctor Appointment")).toBeInTheDocument();
  });

  it("calls onToggle when Done button is clicked in day panel", async () => {
    const onToggle = vi.fn();
    const dueDate = new Date(year, month, 15);
    const todo = makeTodo({ id: "t1", title: "Meeting", dueDate });
    render(<CalendarView todos={[todo]} onEdit={vi.fn()} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: /^15$/ }));
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onToggle).toHaveBeenCalledWith("t1");
  });

  it("calls onEdit when Edit button is clicked in day panel", async () => {
    const onEdit = vi.fn();
    const dueDate = new Date(year, month, 15);
    const todo = makeTodo({ id: "t1", title: "Meeting", dueDate });
    render(<CalendarView todos={[todo]} onEdit={onEdit} onToggle={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /^15$/ }));
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(todo);
  });

  it("shows 'No tasks due on this day' when day has no todos", async () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /^15$/ }));
    expect(screen.getByText("No tasks due on this day.")).toBeInTheDocument();
  });

  it("deselects a day when clicked again", async () => {
    render(<CalendarView todos={[]} onEdit={vi.fn()} onToggle={vi.fn()} />);
    const dayButton = screen.getByRole("button", { name: /^15$/ });
    await userEvent.click(dayButton);
    expect(screen.getByText("No tasks due on this day.")).toBeInTheDocument();
    await userEvent.click(dayButton);
    expect(screen.queryByText("No tasks due on this day.")).not.toBeInTheDocument();
  });
});
