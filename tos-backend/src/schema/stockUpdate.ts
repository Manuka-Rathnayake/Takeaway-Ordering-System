import { z } from "zod";

export const UnitDataSchema = z.object({
  unit: z.number().positive("Unit must be a positive number"),
  unitSymbol: z.string().min(1, "Unit symbol is required")
});

export const AddStockUpdateSchema = z.object({
  ingredientId: z.string(), // MongoDB ObjectId as string
  productBrand: z.string().min(2, "Product brand must be at least 2 characters"),
  stockedUnit: UnitDataSchema
});

export const UpdateStockUpdateSchema = z.object({
  ingredientId: z.string().optional(),
  productBrand: z.string().min(2, "Product brand must be at least 2 characters").optional(),
  stockedUnit: UnitDataSchema.optional()
});

export const GetTableStockUpdateSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'productBrand']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  productBrand: z.string().optional(),
  ingredientId: z.string().optional()
});
