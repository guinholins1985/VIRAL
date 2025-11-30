import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/app/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import { User, AdsenseConfig, AppSettings, RewardConfig } from './types';
import { getCurrentUser, login as apiLogin, register as apiRegister, getAdsenseConfig, getAppSettings, getRewardConfig } from './services/apiService';

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

  // Global states for admin configurations
  const [adsenseConfig, setAdsenseConfig] = useState<AdsenseConfig | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [rewardConfig, setRewardConfig] = useState<RewardConfig | null>(null);

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

  // Function to refresh global AdsenseConfig state
  const updateGlobalAdsenseConfig = useCallback(async () => {
    const config = await getAdsenseConfig();
    setAdsenseConfig(config);
  }, []);

  // Function to refresh global AppSettings state
  const updateGlobalAppSettings = useCallback(async () => {
    const settings = await getAppSettings();
    setAppSettings(settings);
  }, []);

  // Function to refresh global RewardConfig state
  const updateGlobalRewardConfig = useCallback(async () => {
    const config = await getRewardConfig();
    setRewardConfig(config);
  }, []);


  useEffect(() => {
    // Initial fetch for all global configs
    const fetchAllConfigs = async () => {
      await updateGlobalAdsenseConfig();
      await updateGlobalAppSettings();
      await updateGlobalRewardConfig();
    };
    
    checkAuth();
    fetchAllConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to dynamically inject AdSense verification meta tags
  useEffect(() => {
    const cleanupElements: HTMLElement[] = []; // Collect elements to remove on cleanup

    if (adsenseConfig && adsenseConfig.verificationCodes) {
      adsenseConfig.verificationCodes.forEach(code => {
        if (code.trim()) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(code, 'text/html');
          const metaTag = doc.head.querySelector('meta');

          if (metaTag) {
            // Check if a meta tag with the same name and content already exists
            const existingMeta = document.head.querySelector(`meta[name="${metaTag.name}"][content="${metaTag.content}"]`);
            if (!existingMeta) {
              document.head.appendChild(metaTag);
              cleanupElements.push(metaTag);
            }
          } else {
            console.warn("Código de verificação do AdSense inválido detectado (não é uma tag meta válida):", code);
          }
        }
      });
    }

    // Cleanup function: remove all injected elements when component unmounts or adsenseConfig changes
    return () => {
      cleanupElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [adsenseConfig]); // Re-run effect when adsenseConfig changes

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

  if (loading || !adsenseConfig || !appSettings || !rewardConfig) {
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
        <AppLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          geminiApiKey={appSettings.geminiApiKey} // Pass updated API key
          rewardConfig={rewardConfig} // Pass updated reward config
        />
      )}
      {currentRoute === AppRoute.ADMIN && currentUser && currentUser.isAdmin && (
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onUpdateGlobalAdsenseConfig={updateGlobalAdsenseConfig}
          onUpdateGlobalAppSettings={updateGlobalAppSettings}
          onUpdateGlobalRewardConfig={updateGlobalRewardConfig}
        />
      )}
    </div>
  );
};

export default App;