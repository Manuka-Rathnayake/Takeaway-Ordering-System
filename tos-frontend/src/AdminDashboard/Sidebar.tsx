import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaHistory,
  FaShoppingBag,
  FaSearch,
  FaBell,
  FaCog,
} from 'react-icons/fa';
import axios from 'axios';
import { create } from 'zustand';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface NavigationState {
  activeItem: string;
  setActiveItem: (item: string) => void;
  notifications: number;
  setNotifications: (count: number) => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  activeItem: 'Dashboard',
  setActiveItem: (item) => set({ activeItem: item }),
  notifications: 0,
  setNotifications: (count) => set({ notifications: count }),
}));

const AdminLayout: React.FC = () => {
  const { activeItem, setActiveItem, notifications, setNotifications } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const navItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: FaHome,
    },
    {
      name: 'Menu Management',
      path: '/admin/menumanagement',
      icon: FaClipboardList,
    },
    {
      name: 'Stock Management',
      path: '/admin/stockmanagement',
      icon: FaShoppingBag,
    },
    {
      name: 'User Management',
      path: '/admin/usermanagement',
      icon: FaUsers,
    },
    {
      name: 'Order History',
      path: '/admin/orderhistory',
      icon: FaHistory,
    },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data.count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-red-50 text-red-500'
                  : 'text-gray-600 hover:text-red-500 hover:bg-red-100'
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mx-6 mt-8">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <img
                src="/img1.png"
                alt="Chef"
                className="w-16 h-16 mb-2"
              />
              <p className="text-sm text-gray-600 text-center mb-4">
                Please organize your menus through button below!
              </p>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                <span className="mr-2">+</span>
                Add Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          {/* Search Bar */}
          <div className="flex items-center w-1/3 relative">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer">
              <FaBell className="text-gray-600 text-xl" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <FaCog className="text-gray-600 text-xl cursor-pointer" />
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
