import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
  user: null, // User data
  notifications: [], // Notifications
  fetchUser: async () => {
    try {
      const response = await axios.get('/api/user'); // Replace with your API endpoint
      set({ user: response.data });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  },
  fetchNotifications: async () => {
    try {
      const response = await axios.get('/api/notifications'); // Replace with your API endpoint
      set({ notifications: response.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
}));
export default useStore;


interface DashboardState {
  userName: string;
  totalOrders: number;
  activeOrders: number;
  totalUsers: number;
  totalRevenue: number;
  fetchData: () => void;
  setUserName: (name: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  userName: '',
  totalOrders: 0,
  activeOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  fetchData: async () => {
    try {
      const response = await axios.get('/api/dashboard'); // Adjust endpoint accordingly
      set({
        totalOrders: response.data.totalOrders,
        activeOrders: response.data.activeOrders,
        totalUsers: response.data.totalUsers,
        totalRevenue: response.data.totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  },
  setUserName: (name) => set({ userName: name }),
}));
