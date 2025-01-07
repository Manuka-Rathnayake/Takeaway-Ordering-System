import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import api from '@/utils/axios';
import OrderHistory from '../Orderhistory/order-history';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/analytic')
      const data = response.data;
      setDashboardData(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsLoading(false);
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await fetch('/api/user'); // Adjust endpoint as needed
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      const data = await response.json();
      setUserName(data.name || 'User');
    } catch (err) {
      console.error(err);
      setUserName('User');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await fetchUserName();
      await fetchDashboardData();
    };

    initializeDashboard();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">
        Hi, {isLoading ? '...' : userName || 'User'}. Welcome back!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <DashboardCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon="/Icon_Order.png"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Active Orders"
          value={dashboardData.activeOrders}
          icon="/icon Delivered.png"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon="/Group 210.png"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Total Revenue"
          value={dashboardData.totalRevenue}
          icon="/Group 148.png"
          isLoading={isLoading}
          prefix="Rs."
        />
      </div>
      {/* <OrderHistory /> */}
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
  isLoading: boolean;
  prefix?: string;
}

function DashboardCard({ title, value, icon, isLoading, prefix = '' }: DashboardCardProps) {
  return (
    <Card className="shadow-lg rounded-lg p-4 bg-white items-center justify-center ">
      <CardHeader>
        <div className="flex flex-col items-center space-x-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={icon} alt={title} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className='items-center justify-center' >

        <p className="text-3xl items-end justify-center font-bold text-gray-800">
          {isLoading ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            `${prefix}${value}`
          )}
        </p>
      </CardContent>
    </Card>
  );
}
