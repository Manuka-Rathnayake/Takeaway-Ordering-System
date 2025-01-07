import { Navigate, useLocation } from 'react-router-dom';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import api from '@/utils/axios';

// Types
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('auth/verify', {
          withCredentials: true
        });

        if (res.status == 200) {
          setIsAuthenticated(true);
          setUserRole(res.data.section);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    userRole,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Don't redirect while checking authentication
  if (isLoading) {
    // You can replace this with a loading spinner component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only redirect after we're sure about the authentication state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
api.defaults.withCredentials = true;

// import { Navigate, useLocation } from 'react-router-dom';
// import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// import api from '@/utils/axios';
//
// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles?: string[];
// }
//
// export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
//   const { isAuthenticated, userRole } = useAuth();
//   const location = useLocation();
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//
//   if (allowedRoles && !allowedRoles.includes(userRole || '')) {
//     return <Navigate to="/unauthorized" replace />;
//   }
//
//   return <>{children}</>;
// };
//
// // components/AuthContext.tsx
//
// interface AuthContextType {
//   isAuthenticated: boolean;
//   userRole: string | null;
//   login: (role: string) => void;
//   logout: () => void;
// }
//
// const AuthContext = createContext<AuthContextType | null>(null);
//
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);
//
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get('/auth/verify');
//         if (res.status === 200) {
//           setIsAuthenticated(true);
//           setUserRole(res.data.role);
//         }
//       } catch (error) {
//         console.log(error)
//         setIsAuthenticated(false);
//         setUserRole(null);
//       }
//     };
//     checkAuth();
//   }, []);
//
//   const login = (role: string) => {
//     setIsAuthenticated(true);
//     setUserRole(role);
//   };
//
//   const logout = async () => {
//     try {
//       await api.post('auth/logout');
//       setIsAuthenticated(false);
//       setUserRole(null);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };
//
//   return (
//     <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
