import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/app/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import { User, AdsenseConfig } from './types';
import { getCurrentUser, login as apiLogin, register as apiRegister, getAdsenseConfig } from './services/apiService';

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

  // Effect to dynamically inject AdSense verification codes and the main AdSense script into the document head
  useEffect(() => {
    const cleanupElements: HTMLElement[] = []; // Collect elements to remove on cleanup

    const injectAdsenseElements = async () => {
      try {
        const adsenseConfig: AdsenseConfig = await getAdsenseConfig();

        // 1. Inject AdSense Verification Meta Tags
        adsenseConfig.verificationCodes.forEach(code => {
          if (code.trim()) { // Ensure code is not empty
            const parser = new DOMParser();
            const doc = parser.parseFromString(code, 'text/html');
            const metaTag = doc.head.querySelector('meta');

            if (metaTag && !document.head.querySelector(`meta[name="${metaTag.name}"][content="${metaTag.content}"]`)) {
              document.head.appendChild(metaTag);
              cleanupElements.push(metaTag);
            } else if (!metaTag) {
              console.warn("Código de verificação do AdSense inválido detectado (não é uma tag meta):", code);
            }
          }
        });

        // 2. Inject AdSense Main Script for Ad Serving
        if (adsenseConfig.adsenseId && !document.head.querySelector(`script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.adsenseId}"]`)) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.adsenseId}`;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
          cleanupElements.push(script); // Add script to cleanup list
        }

      } catch (error) {
        console.error("Erro ao buscar ou injetar elementos do AdSense:", error);
      }
    };

    injectAdsenseElements();

    // Cleanup function: remove all injected elements when component unmounts
    return () => {
      cleanupElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []); // Run once on component mount

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