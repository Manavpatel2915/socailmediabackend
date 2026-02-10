
export const ENUMS = {
  role: ['Admin', 'user'] as const
} as const;

export type UserRole = typeof ENUMS.role[number];