import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MainLogin } from '@/pages/login';

//import Sidebar from '@/components/ui/Admindashboard/Sidebar';
import { StockManagement } from '@/components/ui/Admindashboard/Stockmanegement/stockmanagement';
//import MenuManagement from '@/components/ui/Admindashboard/Menumanagement/menu-management'



// import KitchenDashboard from '@/KitchenDashboard/Kitchen';
// import CashierDashboard from '@/CashierDashboard/Cashier';
// import MenuDashboard from '@/MenuDashboard/Menu';
// import Admin from '@/AdminDashboard/Dashboard';
import Sidebar from '@/components/ui/Admindashboard/Sidebar'; // Import Sidebar Component
import { Menu } from 'lucide-react';
// import Stockmanagement from './components/ui/Admindashboard/Stockmanegement/StockManagement';
import Menumanagement from '@/components/ui/Admindashboard/Menumanagement/menu-management'

import Dashboard from './components/ui/Admindashboard/Dashboard/dashboard';
import UserManagement from './components/ui/Admindashboard/Usermanagement/userman';
import OrderHistory from './components/ui/Admindashboard/Orderhistory/order-history';
import IngredientManagement from './components/ui/Admindashboard/Ingredients/Ingreidentsmanagement';


import KitchenDashboard from '@/KitchenDashboard/kitchendashboard';
// import CashierDashboard from '@/CashierDashboard/Cashier';
// import MenuDashboard from '@/MenuDashboard/Menu';
// import Admin from '@/AdminDashboard/Dashboard';
//import Sidebar from '@/AdminDashboard/Sidebar'; // Import Sidebar Component
//import Menumanegment from './AdminDashboard/Menumanegment';
//import Stockmanagement from './AdminDashboard/Stockmanagement';
// import Usermanagement from './AdminDashboard/Usermanagement';
// import Orderhistory from './AdminDashboard/Orderhistory';
import LiveOrderBoard from './KitchenDashboard/liveorderboard';
import KitchenSidebar from './KitchenDashboard/Sidebar';
import PendingOrderPage from './KitchenDashboard/pendingOrders';
import ProcessingOrderPage from './KitchenDashboard/processingOrder';
import CompleteOrderPage from './KitchenDashboard/completeOrder';
import CanceleOrderPage from './KitchenDashboard/cancelOrder';


// App Component with Routing

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<MainLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />


        {/* Kitchen, Cashier, Menu Dashboards */}

        <Route path="/kitchen" element={<KitchenDashboard />} />

        <Route path="/kitchen/*" element={<KitchenSidebar />} >
          <Route index element={<KitchenDashboard />} />
          <Route path="pendingorders" element={<PendingOrderPage />} />
          <Route path="processingorders" element={<ProcessingOrderPage />} />
          <Route path="completeorders" element={<CompleteOrderPage />} />
          <Route path="cancelorders" element={<CanceleOrderPage />} />
        </Route>

        {/* <Route path="/cashier" element={<CashierDashboard />} /> */}
        {/* <Route path="/menu" element={<MenuDashboard />} /> */}


        {/* Admin Routes */}
        <Route path="/admin" element={<Sidebar />}>
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
  );
}

export default App;

