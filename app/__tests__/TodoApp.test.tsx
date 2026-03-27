import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoApp from "../components/TodoApp";

const dict = {
  nav: { title: "Todo App" },
  page: {
    heading: "My Todos",
    addButton: "Add Todo",
    noTodos: "No todos yet.",
    showDone: "Show Done",
    hideDone: "Hide Done",
  },
  form: {
    titlePlaceholder: "What needs to be done?",
    descriptionPlaceholder: "Description (optional)",
    addButton: "Add Todo",
    saveButton: "Save Changes",
    cancelButton: "Cancel",
  },
  todo: {
    markComplete: "Mark as complete",
    markIncomplete: "Mark as incomplete",
    edit: "Edit",
    delete: "Delete",
    overdue: "Overdue",
  },
  stats: { active: "Active", done: "Done", urgent: "Urgent" },
  lang: { en: "English", es: "Español", fr: "Français" },
};

describe("TodoApp", () => {
  it("shows 'Show Done' toggle button by default", () => {
    render(<TodoApp dict={dict} />);
    expect(screen.getByRole("button", { name: "Show Done" })).toBeInTheDocument();
  });

  it("hides completed tasks by default", () => {
    render(<TodoApp dict={dict} />);
    // Completed items should not appear — all visible checkboxes should be incomplete
    const incompleteButtons = screen.queryAllByRole("button", { name: /mark as complete/i });
    const completeButtons = screen.queryAllByRole("button", { name: /mark as incomplete/i });
    expect(incompleteButtons.length).toBeGreaterThan(0);
    expect(completeButtons.length).toBe(0);
  });

  it("shows completed tasks after clicking the toggle", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getByRole("button", { name: "Show Done" }));
    const completeButtons = screen.queryAllByRole("button", { name: /mark as incomplete/i });
    expect(completeButtons.length).toBeGreaterThan(0);
  });

  it("changes toggle label to 'Hide Done' when done tasks are visible", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getByRole("button", { name: "Show Done" }));
    expect(screen.getByRole("button", { name: "Hide Done" })).toBeInTheDocument();
  });

  it("hides done tasks again when toggle is clicked twice", async () => {
    render(<TodoApp dict={dict} />);
    const toggle = screen.getByRole("button", { name: "Show Done" });
    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole("button", { name: "Hide Done" }));
    expect(screen.getByRole("button", { name: "Show Done" })).toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /mark as incomplete/i }).length).toBe(0);
  });

  it("renders high-priority incomplete tasks before lower-priority ones", () => {
    render(<TodoApp dict={dict} />);
    // Find positions of high vs low priority items by checking rendered priority badges
    const badges = screen.getAllByText(/^(high|medium|low)$/);
    const priorities = badges.map((el) => el.textContent as string);

    // No "low" should appear before "high"
    const highIdx = priorities.indexOf("high");
    const lowIdx = priorities.indexOf("low");
    if (highIdx !== -1 && lowIdx !== -1) {
      expect(highIdx).toBeLessThan(lowIdx);
    }
  });
});
