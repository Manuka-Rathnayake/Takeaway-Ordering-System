import { z } from "zod";
import { UnitSymbol } from "./ingredients";

export const MenuIngredientSchema = z.object({
  id: z.string(), // MongoDB ObjectId as string
  stockLevel: z.object({
    unit: z.number(),
    unitSymbol: z.enum(UnitSymbol),
  })
});

export const AddMenuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  des: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  ingredients: z.array(MenuIngredientSchema).optional()
});

export const UpdateMenuItemSchema = z.object({
  name: z.string().optional(),
  des: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
});

export const AddIngredientToMenuItemSchema = z.object({
  ingredientId: z.string(), // MongoDB ObjectId as string
});

export const RemoveIngredientFromMenuItemSchema = z.object({
  ingredientId: z.string(), // MongoDB ObjectId as string
});

export const GetTableMenuItemSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional()
});
