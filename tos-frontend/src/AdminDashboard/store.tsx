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
