import React from 'react';
import CashierDashboard from '@/components/CashierDashboard/cashierdashboard';
import useCashierStore from '@/Store/cashierStore';

const AdminLayout: React.FC = () => {
  const { companyName } = useCashierStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#EF4444] shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{companyName} - Cashier Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CashierDashboard />
      </main>
    </div>
  );
};

export default AdminLayout;

