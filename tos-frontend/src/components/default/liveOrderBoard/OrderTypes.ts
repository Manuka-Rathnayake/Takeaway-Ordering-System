export interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  menuItems: MenuItem[];
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  timestamp: number;
}

export const ORDER_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const STATUS_COLORS = {
  [ORDER_STATUS.NEW]: 'bg-yellow-100 border-yellow-400',
  [ORDER_STATUS.PROCESSING]: 'bg-blue-100 border-blue-400',
  [ORDER_STATUS.COMPLETED]: 'bg-green-100 border-green-400',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 border-red-400',
} as const;

// Mock API function
export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real application, this would be the response from the server
  return {
    id: orderId,
    status: newStatus,
    customerName: 'John Doe',
    phoneNumber: '123-456-7890',
    menuItems: [],
    timestamp: Date.now(),
  };
};

