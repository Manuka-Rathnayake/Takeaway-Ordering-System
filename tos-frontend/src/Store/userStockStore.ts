import { create } from 'zustand'
import { DecimalType } from '@/types/types'
import api from '@/utils/axios'

export interface addStockUpdate {
  ingredientId: string;
  brand: string;
  quantity: number;
  unitSymbol: string;
}

export interface stockUpdateI {
  stockedUnit: {
    unit: DecimalType;
    unitSymbol: string;
  };
  _id: string;
  ingredientId: {
    _id: string;
    name: string;
  };
  productBrand: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StockStore {
  items: stockUpdateI[]
  loading: boolean
  error: string | null
  selectedItem: stockUpdateI | null
  fetchStock: () => Promise<void>
  addStock: (data: addStockUpdate) => Promise<void>
  updateStock: (id: string, data: addStockUpdate) => Promise<void>
  deleteStock: (id: string) => Promise<void>
  setSelectedItem: (item: stockUpdateI | null) => void
}

// const generateId = () => {
//   return `STK${Math.random().toString(36).substr(2, 9)}`
// }

export const useStockStore = create<StockStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  selectedItem: null,

  fetchStock: async () => {
    try {
      set({ loading: true })
      const res = await api.get('stockupdate/all')
      const data: stockUpdateI[] = res.data.data;
      set({ items: data })
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to fetch stock items', loading: false })
    } finally {
      set({ loading: false })
    }
  },

  addStock: async (data) => {
    try {
      const { fetchStock } = get();
      const req = {
        ingredientId: data.ingredientId,
        productBrand: data.brand,
        stockedUnit: {
          unit: data.quantity,
          unitSymbol: data.unitSymbol
        }
      }
      console.log(req)
      await api.post('/stockupdate/add', req)
      fetchStock()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to add stock item' })
    }
  },

  updateStock: async (id, data) => {
    try {
      const { fetchStock } = get();
      const req = {
        ingredientId: data.ingredientId,
        productBrand: data.brand,
        stockedUnit: {
          unit: data.quantity,
          unitSymbol: data.unitSymbol
        }
      }
      console.log(req)
      await api.put(`/stockupdate/${id}`, req)
      fetchStock()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update stock item' })
    }
  },

  deleteStock: async (id) => {
    try {
      const { fetchStock } = get();
      await api.delete(`/stockupdate/${id}`)
      fetchStock()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to delete stock item' })
    }
  },

  setSelectedItem: (item: stockUpdateI | null) => {
    set({ selectedItem: item })
  }
}))

