import type { Industry } from "@/types/industry";
import { industryNames } from "@/constants/industries";

export const industries: Industry[] = industryNames.map((name, index) => ({
  id: `industry-${index + 1}`,
  name,
  description: `Solutions tailored for ${name.toLowerCase()} teams and workflows.`,
}));