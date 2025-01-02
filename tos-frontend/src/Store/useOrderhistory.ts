import { create } from 'zustand'
import { mockOrders } from '@/mockOders'

type OrderStatus = 'pending' | 'completed' | 'cancelled'
type KitchenStatus = 'queued' | 'preparing' | 'ready' | 'served'

interface MenuItem {
  menuItemId: string
  quantity: number
}

interface Payment {
  isPaid: boolean
  paymentMethod?: string
  time?: Date
  userId?: string
}

export interface Order {
  id: string
  customerNumber: string
  customerName: string
  status: OrderStatus
  statusKitchen: KitchenStatus
  addUser: string
  price: number
  totalPrice: number
  discount: number
  menuItems: MenuItem[]
  payment: Payment
  createdAt: Date
  updatedAt: Date
}

interface OrderStore {
  orders: Order[]
  selectedOrder: Order | null
  statusFilter: OrderStatus | 'all'
  searchQuery: string
  setStatusFilter: (status: OrderStatus | 'all') => void
  setSearchQuery: (query: string) => void
  setSelectedOrder: (order: Order | null) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: mockOrders,
  selectedOrder: null,
  statusFilter: 'all',
  searchQuery: '',
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}))

