import { z } from "zod";

const OrderStatus = ["pending", "completed", "cancelled"] as const;
const KitchenStatus = ["queued", "preparing", "ready", "served"] as const;

export const OrderMenuItemSchema = z.object({
  id: z.string(), // MongoDB ObjectId as string
  // name: z.string().min(2, "Name must be at least 2 characters"),
  // price: z.number().positive("Price must be positive"),
  quantity: z.number().positive().default(1)
});

export const PaymentSchema = z.object({
  isPaid: z.boolean().default(false),
  paymentMethod: z.string(),
  time: z.date(),
  user: z.string()
})

export const AddOrderSchema = z.object({
  customerNumber: z.string().min(1, "Customer number is required"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  status: z.enum(OrderStatus).optional().default("pending"),
  statusKitchen: z.enum(KitchenStatus).optional().default("queued"),
  // addUser: z.string().min(1, "Add user is required"),
  // price: z.number().positive("Price must be positive"),
  // totalPrice: z.number().positive("Total price must be positive"),
  discount: z.number().nonnegative("Discount cannot be negative").optional().default(0),
  menuItem: z.array(OrderMenuItemSchema).min(1, "At least one menu item is required"),
  isPaid: z.boolean().default(false),
  paymentMethod: z.string().optional(),
  time: z.date().optional(),
  user: z.string().optional()
});

export const UpdateOrderSchema = z.object({
  customerNumber: z.string().optional(),
  customeName: z.string().optional(),
  status: z.enum(OrderStatus).optional(),
  statusKitchen: z.enum(KitchenStatus).optional(),
  price: z.number().positive("Price must be positive").optional(),
  totalPrice: z.number().positive("Total price must be positive").optional(),
  discount: z.number().nonnegative("Discount cannot be negative").optional(),
});

export const GetTableOrderSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'status', 'totalPrice', 'isPaid']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(OrderStatus).optional(),
  search: z.string().optional()
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus).optional(),
  statusKitchen: z.enum(KitchenStatus).optional()
});

export const AddMenuItemToOrderSchema = z.object({
  menuItemId: z.string(), // MongoDB ObjectId as string
  quantity: z.number().int().positive("Quantity must be a positive integer")
});

export const RemoveMenuItemFromOrderSchema = z.object({
  menuItemId: z.string(), // MongoDB ObjectId as string
});

export const GetOrderByStatusSchema = z.object({
  status: z.string().optional(),
  statusKitchen: z.string().optional()
})
