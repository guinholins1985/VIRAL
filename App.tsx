import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/app/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import { User, AdsenseConfig, AppSettings, RewardConfig, Video } from './types';
import { getCurrentUser, login as apiLogin, register as apiRegister, getAdsenseConfig, getAppSettings, getRewardConfig, getVideos } from './services/apiService'; // Import getVideos

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
  const [loadingAppConfig, setLoadingAppConfig] = useState(true); // Renamed for clarity: initial app config loading

  // Global states for admin configurations
  const [adsenseConfig, setAdsenseConfig] = useState<AdsenseConfig | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [rewardConfig, setRewardConfig] = useState<RewardConfig | null>(null);

  // Global states for video list (elevated from AppLayout)
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);


  const checkAuth = useCallback(async () => {
    setLoadingAppConfig(true);
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
    setLoadingAppConfig(false);
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

  // Centralized function to refresh the video list
  const refreshVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error("Falha ao buscar vídeos:", error);
      setVideos([]); // Clear videos on error
    } finally {
      setLoadingVideos(false);
    }
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
    refreshVideos(); // Initial fetch of videos
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
    setLoadingAppConfig(true);
    const user = await apiLogin(emailOrUsername, pass);
    if (user) {
      setCurrentUser(user);
      if (user.isAdmin) {
        setCurrentRoute(AppRoute.ADMIN);
      } else {
        setCurrentRoute(AppRoute.APP);
      }
      setLoadingAppConfig(false);
      return true;
    }
    setLoadingAppConfig(false);
    return false;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoadingAppConfig(true);
    const user = await apiRegister(name, email, pass);
    if (user) {
      setCurrentUser(user);
      setCurrentRoute(AppRoute.APP);
      setLoadingAppConfig(false);
      return true;
    }
    setLoadingAppConfig(false);
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

  if (loadingAppConfig || loadingVideos || !adsenseConfig || !appSettings || !rewardConfig) {
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
          adsenseConfig={adsenseConfig} // Pass updated adsense config
          videos={videos} // Pass videos from App.tsx
          loadingVideos={loadingVideos} // Pass loading state for videos
          refreshVideos={refreshVideos} // Pass the refresh callback
        />
      )}
      {currentRoute === AppRoute.ADMIN && currentUser && currentUser.isAdmin && (
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onUpdateGlobalAdsenseConfig={updateGlobalAdsenseConfig}
          onUpdateGlobalAppSettings={updateGlobalAppSettings}
          onUpdateGlobalRewardConfig={updateGlobalRewardConfig}
          refreshVideos={refreshVideos} // Pass the refresh callback
        />
      )}
    </div>
  );
};

export default App;