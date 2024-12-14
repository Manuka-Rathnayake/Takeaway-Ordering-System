import React, { useEffect } from 'react';
import { useDashboardStore } from '@/AdminDashboard/store';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const {
    userName,
    totalOrders,
    activeOrders,
    totalUsers,
    totalRevenue,
    fetchData,
    setUserName,
  } = useDashboardStore();

  useEffect(() => {
    // Fetch data when component loads
    fetchData();

    // Simulate fetching logged-in user data
    const loggedUser = { name: 'Janudi' };
    setUserName(loggedUser.name);
  }, [fetchData, setUserName]);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">Hi, {userName}. Welcome back!</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Total Orders */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img src="/icons/orders.png" alt="Orders" className="w-8 h-8" />
              <h3 className="text-lg font-medium">Total Orders</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img src="/icons/active_orders.png" alt="Active Orders" className="w-8 h-8" />
              <h3 className="text-lg font-medium">Active Orders</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{activeOrders}</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img src="/icons/users.png" alt="Users" className="w-8 h-8" />
              <h3 className="text-lg font-medium">Total Users</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="shadow-lg rounded-lg p-4 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img src="/icons/revenue.png" alt="Revenue" className="w-8 h-8" />
              <h3 className="text-lg font-medium">Total Revenue</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-800">${totalRevenue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
