import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { MainLogin } from '@/pages/login';
import Sidebar from '@/components/ui/Admindashboard/Sidebar';
import { StockManagement } from '@/components/ui/Admindashboard/Stockmanegement/stockmanagement';
import MenuManagement from '@/components/ui/Admindashboard/Menumanagement/menu-management'
import Dashboard from './components/ui/Admindashboard/Dashboard/dashboard';
import UserManagement from './components/ui/Admindashboard/Usermanagement/userman';
import OrderHistory from './components/ui/Admindashboard/Orderhistory/order-history';
import IngredientManagement from './components/ui/Admindashboard/Ingredients/Ingreidentsmanagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<MainLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="menumanagement" element={<MenuManagement />} />
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

