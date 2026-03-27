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

  it("adds a new todo when the form is submitted", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getByRole("button", { name: /\+ add todo/i }));
    await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), "New test task");
    await userEvent.click(screen.getByRole("button", { name: /^add todo$/i }));
    expect(screen.getByText("New test task")).toBeInTheDocument();
  });

  it("cancels adding a todo and hides the form", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getByRole("button", { name: /\+ add todo/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByRole("button", { name: /\+ add todo/i })).toBeInTheDocument();
  });

  it("toggles a todo to completed state", async () => {
    render(<TodoApp dict={dict} />);
    const completeButtons = screen.getAllByRole("button", { name: /mark as complete/i });
    await userEvent.click(completeButtons[0]);
    // After toggling, it may disappear from default view; show done to verify
    await userEvent.click(screen.getByRole("button", { name: /show done/i }));
    expect(screen.getAllByRole("button", { name: /mark as incomplete/i }).length).toBeGreaterThan(0);
  });

  it("deletes a todo", async () => {
    render(<TodoApp dict={dict} />);
    const initialCount = screen.getAllByRole("button", { name: /mark as complete/i }).length;
    await userEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    const newCount = screen.getAllByRole("button", { name: /mark as complete/i }).length;
    expect(newCount).toBe(initialCount - 1);
  });

  it("opens edit form when edit button is clicked", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[0]);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("saves edited todo title", async () => {
    render(<TodoApp dict={dict} />);
    await userEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[0]);
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Edited task title");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText("Edited task title")).toBeInTheDocument();
  });
});
