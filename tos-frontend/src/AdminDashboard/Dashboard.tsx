import React, { useEffect } from 'react';
import { create } from 'zustand';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


// Zustand Store
interface DashboardState {
  userName: string;
  totalOrders: number;
  activeOrders: number;
  totalUsers: number;
  totalRevenue: number;
  isLoading: boolean;
  error: string | null;
  
  fetchDashboardData: () => Promise<void>;
  fetchUserName: () => Promise<void>;
  setUserName: (name: string) => void;
  updateData: (data: Partial<Omit<DashboardState, 'fetchDashboardData' | 'fetchUserName' | 'setUserName' | 'updateData'>>) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userName: '',
  totalOrders: 0,
  activeOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  isLoading: false,
  error: null,

  // Fetch user name
  fetchUserName: async () => {
    try {
      // Replace  API endpoint
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ userName: response.data.name });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user name' 
      });
    }
  },

  // Fetch dashboard data
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/dashboard-metrics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const { 
        totalOrders, 
        activeOrders, 
        totalUsers, 
        totalRevenue 
      } = response.data;

      set({
        totalOrders,
        activeOrders,
        totalUsers,
        totalRevenue,
        isLoading: false
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },

  setUserName: (name) => set({ userName: name }),
  updateData: (newData) => set((state) => ({ ...state, ...newData }))
}));

// Dashboard Component
const Dashboard: React.FC = () => {
  const { 
    userName,
    totalOrders,
    activeOrders,
    totalUsers,
    totalRevenue,
    isLoading,
    error,
    fetchDashboardData,
    fetchUserName
  } = useDashboardStore();

  useEffect(() => {
    // Fetch user name and dashboard data when component mounts
    const initializeDashboard = async () => {
      await fetchUserName();
      await fetchDashboardData();
    };

    initializeDashboard();

    // Fetch dashboard data every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchDashboardData, fetchUserName]);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }

  if (isLoading && !userName) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">
        Hi, {userName || 'User'}. Welcome back!
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Total Orders Card */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8  flex items-center justify-center">
                <img src="Icon_Order.png" alt="Orders" className="" />
              </div>
              <h3 className="text-lg font-medium">Total Orders</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </CardContent>
        </Card>

        {/* Active Orders Card */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8  flex items-center justify-center">
                <img src="icon Delivered.png" alt="Orders" className="" />
              </div>
              </div>
              <h3 className="text-lg font-medium">Active Orders</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{activeOrders}</p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
            <div className="w-8 h-8  flex items-center justify-center">
                <img src="Group 210.png" alt="Orders" className="" />
              </div>
              <h3 className="text-lg font-medium">Total Users</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
          </CardContent>   
        </Card>

        {/* Total Revenue Card */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
            <div className="w-8 h-8  flex items-center justify-center">
                <img src="Group 148.png" alt="Orders" className="" />
              </div>
              <h3 className="text-lg font-medium">Total Revenue</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">Rs.{totalRevenue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
