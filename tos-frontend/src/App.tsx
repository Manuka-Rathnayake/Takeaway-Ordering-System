import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { MainLogin } from '@/pages/login';

// import KitchenDashboard from '@/KitchenDashboard/Kitchen';
// import CashierDashboard from '@/CashierDashboard/Cashier';
// import MenuDashboard from '@/MenuDashboard/Menu';
// import Admin from '@/AdminDashboard/Dashboard';
import Sidebar from '@/components/ui/Admindashboard/Sidebar'; // Import Sidebar Component
import { Menu } from 'lucide-react';
import Stockmanagement from './components/ui/Admindashboard/Stockmanegement/StockManagement';
import Menumanagement from '@/components/ui/Admindashboard/Menumanagement/menu'
import Dashboard from './components/ui/Admindashboard/Dashboard/dashboard';
import Usermanagement from './components/ui/Admindashboard/Usermanagement/usermanagement';
import Orderhistorytable from './components/ui/Admindashboard/Orderhistory/orderhistorytable';
// import Menumanegment from './AdminDashboard/Menumanegment';
// import Stockmanagement from './AdminDashboard/Stockmanagement';
// import Usermanagement from './AdminDashboard/Usermanagement';
// import Orderhistory from './AdminDashboard/Orderhistory';

// App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<MainLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Kitchen, Cashier, Menu Dashboards */}
        {/* <Route path="/kitchen" element={<KitchenDashboard />} />
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/menu" element={<MenuDashboard />} /> */}

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<Sidebar />} // Sidebar wraps all Admin-related pages
        >
          <Route index element={<Dashboard />} />
          <Route path="menumanagement" element={<Menumanagement />} />
          <Route path="stockmanagement" element={<Stockmanagement />} />
          <Route path="usermanagement" element={<Usermanagement />} />
          <Route path="orderhistory" element={<Orderhistorytable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
