import { create } from 'zustand'
import { IMenuItem } from '@/types/types'
import api from '@/utils/axios'


interface MenuStore {
  menuItems: IMenuItem[]
  loading: boolean
  error: string | null
  fetchMenuItems: () => Promise<void>
  addMenuItem: (item: FormData) => Promise<void>
  updateMenuItem: (id: string, item: FormData) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuItems: [],
  loading: false,
  error: null,

  fetchMenuItems: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/menuitems/all')
      const data: IMenuItem[] = res.data.data;

      set({ menuItems: data, loading: false })
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to fetch menu items', loading: false, menuItems: [] })
    }
  },

  addMenuItem: async (formData: FormData) => {
    set({ loading: true, error: null })
    try {
      const { fetchMenuItems } = get();
      await api.post('/menuitems/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      fetchMenuItems()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to add menu item', loading: false })
    }
  },

  updateMenuItem: async (id: string, formData: FormData) => {
    set({ loading: true, error: null })
    try {
      console.log(formData)
      // Simulate API call
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update menu item', loading: false })
    }
  },

  deleteMenuItem: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { fetchMenuItems } = get();
      await api.delete(`/menuitems/${id}`)
      fetchMenuItems()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to delete menu item', loading: false })
    } finally {
      set({ loading: false })
    }
  }
}))

