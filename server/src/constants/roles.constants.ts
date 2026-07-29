export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  HR: "HR",
  SALES: "SALES",
  CLIENT: "CLIENT",
  USER: "USER",
} as const;

export type RoleType = keyof typeof ROLES;
