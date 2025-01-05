import { create } from 'zustand'
// import axios from 'axios'
// import { mockIngredients } from '@/ingredientsmock'
import api from '@/utils/axios'
import { DecimalType } from '@/types/types';

interface IUnitData {
  unit: DecimalType;
  warningLevel?: DecimalType;
  unitSymbol: string;
}

// Ingredient Type
export interface Ingredient {
  stockLevel: IUnitData;
  createdAt: string;
  updatedAt: string;
  name: string;
  _id: string;
  __v: number;
}

export interface AddFormIngredient {
  name: string;
  unitSymbol: string;
  warningLevel: number;
}

export interface EditFormIngredient {
  name: string;
  unitSymbol: string;
  warningLevel: number;
  stockLevel: number
}

interface IngredientStore {
  ingredients: Ingredient[]
  isLoading: boolean
  error: string | null
  fetchIngredients: () => Promise<void>
  addIngredient: (ingredient: AddFormIngredient) => Promise<void>
  updateIngredient: (id: string, ingredient: EditFormIngredient) => Promise<void>
  deleteIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IngredientStore>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/ingredients/all');
      const data: Ingredient[] = res.data.data
      set({ ingredients: data, error: null })

    } catch (error) {
      console.log(error)
      set({ error: 'Failed to fetch ingredients' })
    } finally {
      set({ isLoading: false })
    }
  },

  addIngredient: async (ingredient) => {
    set({ isLoading: true })
    try {
      await api.post('ingredients/add', ingredient)
      const { fetchIngredients } = get();
      fetchIngredients()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to add ingredient' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateIngredient: async (id, ingredient) => {
    set({ isLoading: true })
    try {
      await api.put(`ingredients/${id}`, ingredient)
      const { fetchIngredients } = get();
      fetchIngredients()
    } catch (error) {
      console.log(error)
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
      await api.delete(`ingredients/${id}`)
      const { fetchIngredients } = get();
      fetchIngredients()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to delete ingredient' })
    } finally {
      set({ isLoading: false })
    }
  },
}))

