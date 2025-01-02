import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { MainLogin } from '@/pages/login';
import Sidebar from '@/components/ui/Admindashboard/Sidebar';
import { Menu } from 'lucide-react';
import Stockmanagement from './components/ui/Admindashboard/Stockmanegement/StockManagement';
import Menumanagement from '@/components/ui/Admindashboard/Menumanagement/menu-management'
import Dashboard from './components/ui/Admindashboard/Dashboard/dashboard';
import Usermanagement from './components/ui/Admindashboard/Usermanagement/userman';
import OrderHistory from './components/ui/Admindashboard/Orderhistory/order-history'; // Updated import
import Ingreidents from './components/ui/Admindashboard/Ingredients/Ingreidentsmanagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<MainLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<Sidebar />}
        >
          <Route index element={<Dashboard />} />
          <Route path="menumanagement" element={<Menumanagement />} />
          <Route path="ingredients" element={<Ingreidents />} />
          <Route path="stockmanagement" element={<Stockmanagement />} />
          <Route path="usermanagement" element={<Usermanagement />} />
          <Route path="orderhistory" element={<OrderHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

