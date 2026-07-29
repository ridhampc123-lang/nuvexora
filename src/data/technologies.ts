import type { Technology } from "@/types/technology";
import { technologyNames } from "@/constants/technologies";

export const technologies: Technology[] = technologyNames.map((name, index) => ({
  id: `technology-${index + 1}`,
  name,
  category: index < 4 ? "Frontend" : "Motion / Infrastructure",
  description: "Chosen for performance, maintainability, and excellent developer experience.",
}));