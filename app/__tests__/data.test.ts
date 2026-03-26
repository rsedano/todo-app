import { describe, it, expect } from "vitest";
import { DEMO_TODOS } from "../data";

describe("DEMO_TODOS", () => {
  it("contains at least one todo", () => {
    expect(DEMO_TODOS.length).toBeGreaterThan(0);
  });

  it("every todo has required fields", () => {
    for (const todo of DEMO_TODOS) {
      expect(todo.id).toBeTruthy();
      expect(todo.title).toBeTruthy();
      expect(typeof todo.completed).toBe("boolean");
      expect(["low", "medium", "high"]).toContain(todo.priority);
      expect(["work", "personal", "shopping", "health"]).toContain(todo.category);
    }
  });

  it("has a mix of completed and active todos", () => {
    const completed = DEMO_TODOS.filter((t) => t.completed);
    const active = DEMO_TODOS.filter((t) => !t.completed);
    expect(completed.length).toBeGreaterThan(0);
    expect(active.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = DEMO_TODOS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
