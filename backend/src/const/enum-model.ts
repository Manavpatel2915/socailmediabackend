export const ENUMS = {
  role: ['Admin', 'User'] as const
} as const;

export type UserRole = typeof ENUMS.role[number];