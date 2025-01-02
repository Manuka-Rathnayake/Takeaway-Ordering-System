import { create } from 'zustand'
import axios from 'axios'

export type Role = 'admin' | 'cashier' | 'customer'

export interface User {
  id: string
  username: string
  email: string
  phonenumber: string
  password: string
  role: Role
  nic?: string
  createdAt: Date
  updatedAt: Date
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

import { mockUsers } from '@/mock-users'

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
  updateUser: (id: string, userData: UserFormData) => Promise<void>
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
      set({ isLoading: true, error: null })
      // this would be an API call(real app)
      // const response = await axios.post('/api/users', userData)
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const { users } = get()
      const updatedUsers = [...users, newUser]
      set({ users: updatedUsers, filteredUsers: updatedUsers })
    } catch (error) {
      set({ error: 'Failed to add user' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null })
      // this would be an API call(real app)
      // const response = await axios.put(`/api/users/${id}`, userData)
      const { users } = get()
      const updatedUsers = users.map(user => 
        user.id === id 
          ? { ...user, ...userData, updatedAt: new Date() }
          : user
      )
      set({ users: updatedUsers, filteredUsers: updatedUsers })
    } catch (error) {
      set({ error: 'Failed to update user' })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null })
      // this would be an API call(real app)
      // await axios.delete(`/api/users/${id}`)
      const { users } = get()
      const updatedUsers = users.filter(user => user.id !== id)
      set({ users: updatedUsers, filteredUsers: updatedUsers })
    } catch (error) {
      set({ error: 'Failed to delete user' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null })
      // this would be an API call(real app)
      // const response = await axios.get('/api/users')
      // const users = response.data
      const users = mockUsers
      set({ users, filteredUsers: users })
    } catch (error) {
      set({ error: 'Failed to fetch users' })
    } finally {
      set({ isLoading: false })
    }
  }
}))

