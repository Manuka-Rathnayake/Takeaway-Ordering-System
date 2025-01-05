import { create } from 'zustand'
import { IOrder } from '@/types/types'
import api from '@/utils/axios'

type OrderStatus = 'pending' | 'completed' | 'cancelled'
// type KitchenStatus = 'queued' | 'preparing' | 'ready' | 'served'
//
// interface MenuItem {
//   menuItemId: string
//   quantity: number
// }
//
// interface Payment {
//   isPaid: boolean
//   paymentMethod?: string
//   time?: Date
//   userId?: string
// }
//
// export interface Order {
//   id: string
//   customerNumber: string
//   customerName: string
//   status: OrderStatus
//   statusKitchen: KitchenStatus
//   addUser: string
//   price: number
//   totalPrice: number
//   discount: number
//   menuItems: MenuItem[]
//   payment: Payment
//   createdAt: Date
//   updatedAt: Date
// }

interface OrderStore {
  orders: IOrder[]
  selectedOrder: IOrder | null
  statusFilter: IOrder | 'all'
  searchQuery: string
  fetchOrders: () => void
  setSearchQuery: (query: string) => void
  setSelectedOrder: (order: IOrder | null) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  selectedOrder: null,
  statusFilter: 'all',
  searchQuery: '',
  fetchOrders: async () => {
    try {
      const res = await api.get('/menuitems/all')
      const data: IOrder[] = res.data.data;

      set({ orders: data })
    } catch (error) {
      console.log(error)
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}))

