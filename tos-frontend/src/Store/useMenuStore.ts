import { create } from 'zustand'
import menuItemsData from '@/menu-item.json'

interface Ingredient {
  name: string
  unit: number
  unitSymbol: string
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image: string | File
  ingredients: Ingredient[]
}

interface MenuStore {
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  fetchMenuItems: () => Promise<void>
  addMenuItem: (item: FormData) => Promise<void>
  updateMenuItem: (id: string, item: FormData) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  loading: false,
  error: null,

  fetchMenuItems: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ menuItems: menuItemsData, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch menu items', loading: false, menuItems: [] })
    }
  },

  addMenuItem: async (formData: FormData) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        image: formData.get('image') as File,
        ingredients: JSON.parse(formData.get('ingredients') as string),
      }
      set((state) => ({
        menuItems: [...state.menuItems, newItem],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to add menu item', loading: false })
    }
  },

  updateMenuItem: async (id: string, formData: FormData) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({
        menuItems: state.menuItems.map((menuItem) =>
          menuItem.id === id
            ? {
                ...menuItem,
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                image: formData.get('image') as File || menuItem.image,
                ingredients: JSON.parse(formData.get('ingredients') as string),
              }
            : menuItem
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update menu item', loading: false })
    }
  },

  deleteMenuItem: async (id: string) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      set((state) => ({
        menuItems: state.menuItems.filter((item) => item.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete menu item', loading: false })
    }
  }
}))

