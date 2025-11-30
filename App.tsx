import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/app/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import { User } from './types';
import { getCurrentUser, login as apiLogin, register as apiRegister } from './services/apiService';

// Define the available routes/pages
enum AppRoute {
  LANDING = 'landing',
  LOGIN = 'login',
  REGISTER = 'register',
  APP = 'app',
  ADMIN = 'admin',
}

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    const user = await getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.isAdmin) {
        setCurrentRoute(AppRoute.ADMIN);
      } else {
        setCurrentRoute(AppRoute.APP);
      }
    } else {
      setCurrentRoute(AppRoute.LANDING);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (emailOrUsername: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const user = await apiLogin(emailOrUsername, pass);
    if (user) {
      setCurrentUser(user);
      if (user.isAdmin) {
        setCurrentRoute(AppRoute.ADMIN);
      } else {
        setCurrentRoute(AppRoute.APP);
      }
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const user = await apiRegister(name, email, pass);
    if (user) {
      setCurrentUser(user);
      setCurrentRoute(AppRoute.APP);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Simulate logout
    setCurrentRoute(AppRoute.LANDING);
  };

  const navigateTo = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-white text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentRoute === AppRoute.LANDING && (
        <LandingPage onStart={() => navigateTo(AppRoute.LOGIN)} />
      )}
      {(currentRoute === AppRoute.LOGIN || currentRoute === AppRoute.REGISTER) && (
        <AuthPage
          isLogin={currentRoute === AppRoute.LOGIN}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchToRegister={() => navigateTo(AppRoute.REGISTER)}
          onSwitchToLogin={() => navigateTo(AppRoute.LOGIN)}
        />
      )}
      {currentRoute === AppRoute.APP && currentUser && !currentUser.isAdmin && (
        <AppLayout currentUser={currentUser} onLogout={handleLogout} />
      )}
      {currentRoute === AppRoute.ADMIN && currentUser && currentUser.isAdmin && (
        <AdminLayout currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;