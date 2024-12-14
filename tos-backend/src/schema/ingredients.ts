import { z } from "zod";

export const UnitSymbol = ["gram", "kilogram", "liter", "mililiter", "ton", "pound", "packet"] as const;

export const AddIngredientSchema = z.object({
  name: z.string(),
  unitSymbol: z.enum(UnitSymbol),
  warningLevel: z.number().nonnegative(),
});

export const UpdateIngredientSchema = z.object({
  name: z.string().optional(),
  unitSymbol: z.enum(UnitSymbol).optional(),
  warningLevel: z.number().nonnegative().optional(),
  stockLevel: z.number().optional()
});

export const GetTableIngredientSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(['name', 'stockLevel', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional()
});
