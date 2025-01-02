import { create } from 'zustand'

export type Role = 'admin' | 'cashier' | 'customer'

export interface User {
  _id: string
  username: string
  email: string
  phonenumber: string
  password?: string
  role: Role
  nic?: string
}

export interface editFormData {
  username: string
  email: string
  phonenumber: string
  role: Role
  nic?: string
}

export interface UserFormData {
  username: string
  email: string
  phonenumber: string
  password: string
  confirmPassword?: string
  role: Role
  nic?: string
}

import api from '@/utils/axios'

interface UserStore {
  users: User[]
  filteredUsers: User[]
  searchTerm: string
  selectedRole: string | null
  isLoading: boolean
  error: string | null
  setSearchTerm: (term: string) => void
  setSelectedRole: (role: string | null) => void
  addUser: (userData: UserFormData) => Promise<void>
  updateUser: (id: string, userData: editFormData) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filteredUsers: [],
  searchTerm: '',
  selectedRole: null,
  isLoading: false,
  error: null,

  setSearchTerm: (term) => {
    set({ searchTerm: term })
    const { users, selectedRole } = get()
    const filtered = users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      const matchesRole = !selectedRole || user.role === selectedRole
      return matchesSearch && matchesRole
    })
    set({ filteredUsers: filtered })
  },

  setSelectedRole: (role) => {
    set({ selectedRole: role })
    const { users, searchTerm } = get()
    const filtered = users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !role || user.role === role
      return matchesSearch && matchesRole
    })
    set({ filteredUsers: filtered })
  },

  addUser: async (userData) => {
    try {
      const { fetchUsers } = get();
      set({ isLoading: true, error: null })
      // In a real app, this would be an API call
      // const response = await axios.post('/api/users', userData)
      await api.post('/auth/register', userData)
      fetchUsers()
    } catch (error) {
      set({ error: 'Failed to add user' })
      console.log(error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null })
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/users/${id}`, userData)
      const { fetchUsers } = get()
      console.log(userData)
      await api.put(`/auth/${id}`, userData)
      fetchUsers()
    } catch (error) {
      set({ error: 'Failed to update user' })
      console.log(error)
    } finally {
      set({ isLoading: false })
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null })
      console.log(id)
      // In a real app, this would be an API call
      // await axios.delete(`/api/users/${id}`)
      const { fetchUsers } = get()
      await api.delete(`/auth/${id}`)
      fetchUsers()
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to delete user' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null })
      // In a real app, this would be an API call
      // const response = await axios.get('/api/users')
      // const users = response.data
      const res = await api.get('/auth/')
      const users: User[] = res.data.users
      console.log(users)
      set({ users, filteredUsers: users })
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to fetch users' })
    } finally {
      set({ isLoading: false })
    }
  }
}))

