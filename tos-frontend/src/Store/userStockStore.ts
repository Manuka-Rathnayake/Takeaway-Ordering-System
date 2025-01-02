import { create } from 'zustand'
import { mockFoods } from '@/stockData'
import type { FoodItem, Unit } from '@/stockData'

interface StockStore {
  items: FoodItem[]
  loading: boolean
  error: string | null
  selectedItem: FoodItem | null
  fetchStock: () => Promise<void>
  addStock: (data: Omit<FoodItem, 'id'>) => Promise<void>
  updateStock: (id: number, data: Omit<FoodItem, 'id'>) => Promise<void>
  deleteStock: (id: number) => Promise<void>
  setSelectedItem: (item: FoodItem | null) => void
}

const generateId = () => {
  return `STK${Math.random().toString(36).substr(2, 9)}`
}

export const useStockStore = create<StockStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  selectedItem: null,

  fetchStock: async () => {
    set({ loading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const itemsWithAutoId = mockFoods.map(item => ({
        ...item,
        id: generateId()
      }))
      set({ items: itemsWithAutoId, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch stock items', loading: false })
    }
  },

  addStock: async (data) => {
    try {
      const newItem: FoodItem = {
        id: generateId(),
        ...data
      }
      set((state) => ({ items: [...state.items, newItem] }))
    } catch (error) {
      set({ error: 'Failed to add stock item' })
    }
  },

  updateStock: async (id, data) => {
    try {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, ...data }
            : item
        )
      }))
    } catch (error) {
      set({ error: 'Failed to update stock item' })
    }
  },

  deleteStock: async (id) => {
    try {
      set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      }))
    } catch (error) {
      set({ error: 'Failed to delete stock item' })
    }
  },

  setSelectedItem: (item: FoodItem | null) => {
    set({ selectedItem: item })
  }
}))

