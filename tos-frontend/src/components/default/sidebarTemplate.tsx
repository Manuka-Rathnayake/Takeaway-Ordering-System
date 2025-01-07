import React, { useState, useEffect, ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import { create } from 'zustand';
import { WebSocketManager } from '@/utils/ws';
import NotificationDropdown from './notificationPanel';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LogOut, User2 } from 'lucide-react';
import { useAuth } from '@/utils/authcontext';
import { Button } from '../ui/button';

// Generic type for navigation items
interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

// Props interface for the AdminLayout
interface NavSidebarProps {
  navigationItems?: NavigationItem[];
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  logoContent?: ReactNode;
  onSearchChange?: (searchTerm: string) => void;
  notificationsEndpoint?: string;
}

// Navigation store remains the same
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

const NavSidebarLayout: React.FC<NavSidebarProps> = ({
  navigationItems = [], // Default to empty array if not provided
  sidebarHeader,
  sidebarFooter,
  logoContent = <h1 className="text-2xl font-bold">Logo</h1>,
  onSearchChange,
  notificationsEndpoint = '/api/notifications'
}) => {
  const { setActiveItem, setNotifications } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };
  // Default navigation items if none are provided
  const defaultNavItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/kitchen',
      icon: FaHome,
    }
  ];

  // Use provided navigation items or fall back to default
  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavItems;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(notificationsEndpoint);
        setNotifications(response.data.count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Only fetch if an endpoint is provided
    if (notificationsEndpoint) {
      fetchNotifications();
    }
  }, [setNotifications, notificationsEndpoint]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Call the custom search handler if provided
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
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
          {logoContent}

          {/* Mobile Close Button */}
          <button
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Optional Sidebar Header */}
        {sidebarHeader && (
          <div className="px-6 mb-4">
            {sidebarHeader}
          </div>
        )}

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${location.pathname === item.path
                ? 'bg-red-50 text-red-500'
                : 'text-gray-600 hover:text-red-500 hover:bg-red-100'
                }`}
              onClick={() => {
                setActiveItem(item.name);
                setIsSidebarOpen(false); // Close sidebar on mobile after selection
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Optional Sidebar Footer */}
        {sidebarFooter && (
          <div className="mx-6 mt-8">
            {sidebarFooter}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
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
              onChange={handleSearchChange}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <div> <WebSocketManager /> </div>
            <NotificationDropdown />
            {/* <div className="relative cursor-pointer"> */}
            {/*   <FaBell className="text-gray-600 text-xl" /> */}
            {/*   {notifications > 0 && ( */}
            {/*     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"> */}
            {/*       {notifications} */}
            {/*     </span> */}
            {/*   )} */}
            {/* </div> */}
            {/* <img */}
            {/*   src="https://via.placeholder.com/40" */}
            {/*   alt="User Avatar" */}
            {/*   className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer" */}
            {/* /> */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger><Button variant="outline" ><User2 /></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleLogout} > <LogOut /> Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NavSidebarLayout;
