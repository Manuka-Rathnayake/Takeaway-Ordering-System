import { create } from 'zustand'
import axios from 'axios'

interface DashboardState {
  userName: string
  totalOrders: number
  activeOrders: number
  totalUsers: number
  totalRevenue: number
  isLoading: boolean
  error: string | null
  
  fetchDashboardData: () => Promise<void>
  fetchUserName: () => Promise<void>
  setUserName: (name: string) => void
  updateData: (data: Partial<Omit<DashboardState, 'fetchDashboardData' | 'fetchUserName' | 'setUserName' | 'updateData'>>) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userName: '',
  totalOrders: 0,
  activeOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  isLoading: false,
  error: null,

  fetchUserName: async () => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      set({ userName: response.data.name })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user name' 
      })
    }
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get('/api/dashboard-metrics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const { 
        totalOrders, 
        activeOrders, 
        totalUsers, 
        totalRevenue 
      } = response.data

      set({
        totalOrders,
        activeOrders,
        totalUsers,
        totalRevenue,
        isLoading: false
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      })
    }
  },

  setUserName: (name) => set({ userName: name }),
  updateData: (newData) => set((state) => ({ ...state, ...newData }))
}))

