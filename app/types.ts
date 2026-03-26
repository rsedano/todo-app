export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: "work" | "personal" | "shopping" | "health";
  createdAt: Date;
  dueDate?: Date;
}
