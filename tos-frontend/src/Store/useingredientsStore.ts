import { create } from 'zustand'
import axios from 'axios'
import { mockIngredients } from '@/ingredientsmock'

interface Ingredient {
  id: string
  name: string
  unit: number
  warningLevel: number
  unitSymbol: string
  createdAt: string
  updatedAt: string
}

interface IngredientStore {
  ingredients: Ingredient[]
  isLoading: boolean
  error: string | null
  fetchIngredients: () => Promise<void>
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => Promise<void>
  deleteIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IngredientStore>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true })
    try {
      // this would be an API call(real app)
      // const response = await axios.get('/api/ingredients')
      // set({ ingredients: response.data, error: null })
      
      // Using mock data for demonstration
      set({ ingredients: mockIngredients, error: null })
    } catch (error) {
      set({ error: 'Failed to fetch ingredients' })
    } finally {
      set({ isLoading: false })
    }
  },

  addIngredient: async (ingredient) => {
    set({ isLoading: true })
    try {
      // this would be an API call(real app)
      // const response = await axios.post('/api/ingredients', ingredient)
      // const newIngredient = response.data
      
      // Simulating API call with mock data
      const newIngredient = {
        ...ingredient,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set(state => ({
        ingredients: [...state.ingredients, newIngredient],
        error: null
      }))
    } catch (error) {
      set({ error: 'Failed to add ingredient' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateIngredient: async (id, ingredient) => {
    set({ isLoading: true })
    try {
      // this would be an API call(real app)
      // await axios.put(`/api/ingredients/${id}`, ingredient)
      
      set(state => ({
        ingredients: state.ingredients.map(item =>
          item.id === id ? { ...item, ...ingredient, updatedAt: new Date().toISOString() } : item
        ),
        error: null
      }))
    } catch (error) {
      set({ error: 'Failed to update ingredient' })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteIngredient: async (id) => {
    set({ isLoading: true })
    try {
      // this would be an API call(real app)
      // await axios.delete(`/api/ingredients/${id}`)
      
      set(state => ({
        ingredients: state.ingredients.filter(item => item.id !== id),
        error: null
      }))
    } catch (error) {
      set({ error: 'Failed to delete ingredient' })
    } finally {
      set({ isLoading: false })
    }
  },
}))

