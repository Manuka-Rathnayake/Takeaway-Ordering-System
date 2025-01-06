import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mockMenuItems, MenuItem } from '@/camenu';
import { z } from 'zod';

const OrderStatus = ['pending', 'completed', 'cancelled'] as const;

const OrderMenuItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
});

export const AddOrderSchema = z.object({
  customerNumber: z.string().min(1, "Customer number is required"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  status: z.enum(OrderStatus).optional().default("pending"),
  statusKitchen: z.enum(OrderStatus).optional().default("pending"),
  discount: z.number().nonnegative("Discount cannot be negative").optional().default(0),
  menuItem: z.array(OrderMenuItemSchema).min(1, "At least one menu item is required"),
  isPaid: z.boolean().default(false),
  paymentMethod: z.string().min(1, "Payment method is required"),
  time: z.date().optional(),
  user: z.string().optional()
});

type AddOrderType = z.infer<typeof AddOrderSchema>;

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  customerNumber: string;
  customerName: string;
}

interface CashierState {
  menuItems: MenuItem[];
  orderItems: OrderItem[];
  customerDetails: CustomerDetails;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  setCustomerDetails: (details: CustomerDetails) => void;
  fetchMenuItems: () => Promise<void>;
  addItemToOrder: (item: MenuItem) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  setDiscount: (discount: number) => void;
  placeOrder: () => Promise<AddOrderType>;
  discount: number;
  companyName: string;
  setCompanyName: (name: string) => void;
}

const useCashierStore = create<CashierState>()(
  devtools(
    persist(
      (set, get) => ({
        menuItems: [],
        orderItems: [],
        customerDetails: { customerNumber: '', customerName: '' },
        paymentMethod: '',
        discount: 0,
        setPaymentMethod: (method) => set({ paymentMethod: method }),
        setCustomerDetails: (details) => set({ customerDetails: details }),
        fetchMenuItems: async () => {
          set({ menuItems: mockMenuItems });
        },
        addItemToOrder: (item) => {
          set((state) => {
            const existingItem = state.orderItems.find((orderItem) => orderItem.menuItemId === item.id);
            if (existingItem) {
              return {
                orderItems: state.orderItems.map((orderItem) =>
                  orderItem.menuItemId === item.id
                    ? { ...orderItem, quantity: orderItem.quantity + 1 }
                    : orderItem
                ),
              };
            } else {
              return {
                orderItems: [...state.orderItems, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }],
              };
            }
          });
        },
        removeItemFromOrder: (itemId) => {
          set((state) => ({
            orderItems: state.orderItems.filter((item) => item.menuItemId !== itemId),
          }));
        },
        updateItemQuantity: (itemId, quantity) => {
          set((state) => ({
            orderItems: state.orderItems.map((item) =>
              item.menuItemId === itemId ? { ...item, quantity } : item
            ),
          }));
        },
        calculateSubtotal: () => {
          const { orderItems } = get();
          return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        calculateTotal: () => {
          const { calculateSubtotal, discount } = get();
          return calculateSubtotal() - discount;
        },
        setDiscount: (discount) => set({ discount }),
        placeOrder: async () => {
          const { orderItems, customerDetails, discount, paymentMethod } = get();
          
          if (!customerDetails.customerName || !customerDetails.customerNumber) {
            throw new Error("Customer details are required");
          }

          if (!paymentMethod) {
            throw new Error("Payment method is required");
          }

          if (orderItems.length === 0) {
            throw new Error("At least one item is required");
          }

          const order: AddOrderType = {
            customerNumber: customerDetails.customerNumber,
            customerName: customerDetails.customerName,
            status: "pending",
            statusKitchen: "pending",
            discount,
            menuItem: orderItems.map(item => ({
              menuItemId: item.menuItemId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            isPaid: false,
            paymentMethod,
            time: new Date(),
          };

          // Validate the order
          AddOrderSchema.parse(order);

          // Reset order after placing
          set({ 
            orderItems: [], 
            customerDetails: { customerNumber: '', customerName: '' }, 
            discount: 0,
            paymentMethod: ''
          });

          return order;
        },
        companyName: 'Mr. Chef',
        setCompanyName: (name) => set({ companyName: name }),
      }),
      {
        name: 'cashier-store',
      }
    )
  )
);

export default useCashierStore;

