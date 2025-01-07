import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MainLogin } from '@/pages/login';

import { StockManagement } from '@/components/ui/Admindashboard/Stockmanegement/stockmanagement';

import Sidebar from '@/components/ui/Admindashboard/Sidebar'; // Import Sidebar Component
import Menumanagement from '@/components/ui/Admindashboard/Menumanagement/menu-management'

import Dashboard from './components/ui/Admindashboard/Dashboard/dashboard';
import UserManagement from './components/ui/Admindashboard/Usermanagement/userman';
import OrderHistory from './components/ui/Admindashboard/Orderhistory/order-history';
import IngredientManagement from './components/ui/Admindashboard/Ingredients/Ingreidentsmanagement';


import KitchenDashboard from '@/KitchenDashboard/kitchendashboard';
import KitchenSidebar from './KitchenDashboard/Sidebar';
import PendingOrderPage from './KitchenDashboard/pendingOrders';
import ProcessingOrderPage from './KitchenDashboard/processingOrder';
import CompleteOrderPage from './KitchenDashboard/completeOrder';
import CanceleOrderPage from './KitchenDashboard/cancelOrder';
import { AuthProvider, ProtectedRoute } from './utils/authcontext';
import { CashierAddMenu } from './components/ui/CashierDashboard/cashierAddOrder';
import CashierSidebar from './components/ui/CashierDashboard/sidebar';


// App Component with Routing

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<MainLogin />} />
          <Route path="/" element={<Navigate to="/login" replace />} />


          {/* Kitchen, Cashier, Menu Dashboards */}

          <Route path="/cashier/*" element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CashierSidebar />
            </ProtectedRoute>
          } >
            <Route index element={<CashierAddMenu />} />
            <Route path="pendingorders" element={<PendingOrderPage />} />
            <Route path="processingorders" element={<ProcessingOrderPage />} />
            <Route path="completeorders" element={<CompleteOrderPage />} />
            <Route path="cancelorders" element={<CanceleOrderPage />} />
            <Route path="orderhistory" element={<OrderHistory />} />
          </Route>
          <Route path="/cash" element={<CashierAddMenu />} />

          <Route path="/kitchen/*" element={
            <ProtectedRoute allowedRoles={["kitchen"]}>
              <KitchenSidebar />
            </ProtectedRoute>
          } >
            <Route index element={<KitchenDashboard />} />
            <Route path="pendingorders" element={<PendingOrderPage />} />
            <Route path="processingorders" element={<ProcessingOrderPage />} />
            <Route path="completeorders" element={<CompleteOrderPage />} />
            <Route path="cancelorders" element={<CanceleOrderPage />} />
          </Route>

          {/* <Route path="/cashier" element={<CashierDashboard />} /> */}
          {/* <Route path="/menu" element={<MenuDashboard />} /> */}


          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Sidebar />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="menumanagement" element={<Menumanagement />} />
            {/* <Route path="stockmanagement" element={<Stockmanagement />} /> */}
            <Route path="usermanagement" element={<UserManagement />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="menumanagement" element={<Menumanagement />} />
            <Route path="ingredients" element={<IngredientManagement />} />
            <Route path="stockmanagement" element={<StockManagement />} />
            <Route path="usermanagement" element={<UserManagement />} />
            <Route path="orderhistory" element={<OrderHistory />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

