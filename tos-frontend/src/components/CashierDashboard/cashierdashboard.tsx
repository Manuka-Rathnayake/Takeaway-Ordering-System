import React, { useEffect } from 'react';
import CustomerDetailsForm from '@/components/CashierDashboard/customerdetailsform';
import MenuItemsTable from '@/components/CashierDashboard/menuitemstable';
import OrderDetails from '@/components/CashierDashboard/orderdetails';
import useCashierStore from '@/Store/cashierStore';
import { Toaster } from "@/components/ui/toaster";

const CashierDashboard: React.FC = () => {
  const { fetchMenuItems } = useCashierStore();

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cashier Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:order-1">
          <MenuItemsTable />
        </div>
        <div className="space-y-8 lg:order-2">
          <CustomerDetailsForm />
          <OrderDetails />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default CashierDashboard;

