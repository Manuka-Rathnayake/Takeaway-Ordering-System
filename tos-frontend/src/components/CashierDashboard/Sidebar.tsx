import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaHistory,
  FaSearch,
  FaBell,
  FaBars,
  FaTimes,
  FaLeaf,
  FaUserCircle
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

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

const useNavigationStore = create<NavigationState>((set) => ({
  activeItem: 'Dashboard',
  setActiveItem: (item) => set({ activeItem: item }),
  notifications: 0,
  setNotifications: (count) => set({ notifications: count }),
}));

const CashierLayout: React.FC = () => {
  const { activeItem, setActiveItem, notifications, setNotifications } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const navItems: NavigationItem[] = [
    {
      name: 'CashierDashboard',
      path: 'adminlayout',
      icon: FaHome,
    },
    {
      name: 'Orders',
      path: 'orders',
      icon: FaClipboardList,
    },
    {
      name: 'Menu',
      path: 'menu',
      icon: FaLeaf,
    },
    {
      name: 'History',
      path: 'history',
      icon: FaHistory,
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data.count);
        setNotificationList(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log('Signing out...');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed md:static z-50 top-0 left-0 w-64 h-full 
          bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="Logo.png" 
              alt="Company Logo"
              className="w-auto  object-contain"
            />
          </Link>
          
          {/* Mobile Close Button */}
          <button 
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                location.pathname.includes(item.path)
                  ? 'bg-red-50 text-red-500'
                  : 'text-gray-600 hover:text-red-500 hover:bg-red-100'
              }`}
              onClick={() => {
                setActiveItem(item.name);
                setIsSidebarOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

       
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden mr-4"
            onClick={toggleSidebar}
          >
            <FaBars className="w-6 h-6" />
          </button>

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
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <FaBell className="text-gray-600 text-xl" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <h3 className="px-4 py-2 font-semibold border-b">Notifications</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationList.length > 0 ? (
                      notificationList.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <FaUserCircle className="text-gray-600 text-2xl" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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

export default CashierLayout;