import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MainLogin } from '@/pages/login';

import KitchenDashboard from '@/KitchenDashboard/kitchendashboard';
import CashierDashboard from '@/CashierDashboard/Cashier';
import MenuDashboard from '@/MenuDashboard/Menu';
import Admin from '@/AdminDashboard/Dashboard';
import Sidebar from '@/AdminDashboard/Sidebar'; // Import Sidebar Component
import Menumanegment from './AdminDashboard/Menumanegment';
import Stockmanagement from './AdminDashboard/Stockmanagement';
import Usermanagement from './AdminDashboard/Usermanagement';
import Orderhistory from './AdminDashboard/Orderhistory';
import LiveOrderBoard from './KitchenDashboard/liveorderboard';
import KitchenSidebar from './KitchenDashboard/Sidebar';

// App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<MainLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Kitchen, Cashier, Menu Dashboards */}
        <Route path="/kitchen/*" element={<KitchenSidebar />} >
          <Route index element={<KitchenDashboard />} />
          <Route path="liveorderboard" element={<LiveOrderBoard />} />
        </Route>
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/menu" element={<MenuDashboard />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<Sidebar />} // Sidebar wraps all Admin-related pages
        >
          <Route index element={<Admin />} />
          <Route path="menumanagement" element={<Menumanegment />} />
          <Route path="stockmanagement" element={<Stockmanagement />} />
          <Route path="usermanagement" element={<Usermanagement />} />
          <Route path="orderhistory" element={<Orderhistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
