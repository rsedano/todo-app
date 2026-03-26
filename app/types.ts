export type Priority = "low" | "medium" | "high";

export type Category = "work" | "personal" | "shopping" | "health";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
}
