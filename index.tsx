import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/app/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import { User, AdsenseConfig, AppSettings, RewardConfig, Video, AppRoute } from './types'; // Import AppRoute from types
import { getCurrentUser, login as apiLogin, register as apiRegister, getAdsenseConfig, getAppSettings, getRewardConfig, getPaginatedVideos } from './services/apiService'; // Import getPaginatedVideos
import { VIDEOS_PER_PAGE } from './constants'; // Import VIDEOS_PER_PAGE

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAppConfig, setLoadingAppConfig] = useState(true); // Renamed for clarity: initial app config loading

  // Global states for admin configurations
  const [adsenseConfig, setAdsenseConfig] = useState<AdsenseConfig | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [rewardConfig, setRewardConfig] = useState<RewardConfig | null>(null);

  // Global states for video list and pagination (elevated from AppLayout)
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true); // Initial load for the first page
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false); // For infinite scroll loading

  // Centralized function to refresh global currentUser state from localStorage
  const refreshCurrentUser = useCallback(async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  }, []);

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

  // Centralized function to load the initial page of videos and reset pagination
  const loadInitialVideos = useCallback(async () => {
    setLoadingVideos(true);
    setCurrentPage(0); // Reset page to 0 for initial load
    setHasMoreVideos(true); // Assume there might be more videos initially
    try {
      // Pass isInitialLoad: true for faster initial fetching
      const { videos: fetchedVideos, total } = await getPaginatedVideos(0, VIDEOS_PER_PAGE, true); 
      setVideos(fetchedVideos);
      // If the first load doesn't fill the page or is exactly total, no more videos
      setHasMoreVideos(fetchedVideos.length < total); 
    } catch (error) {
      console.error("Falha ao buscar vídeos iniciais:", error);
      setVideos([]); // Clear videos on error
      setHasMoreVideos(false);
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  // Centralized function to load more videos for infinite scroll
  const loadMoreVideos = useCallback(async () => {
    if (loadingMoreVideos || !hasMoreVideos) return;

    setLoadingMoreVideos(true);
    try {
      const nextPage = currentPage + 1;
      // Subsequent loads are not initial, so isInitialLoad is false (or omitted)
      const { videos: fetchedVideos, total } = await getPaginatedVideos(nextPage * VIDEOS_PER_PAGE, VIDEOS_PER_PAGE); 
      setVideos(prevVideos => [...prevVideos, ...fetchedVideos]);
      setCurrentPage(nextPage);
      // Corrected: use (nextPage * VIDEOS_PER_PAGE) to accurately check if more videos exist after the current load
      setHasMoreVideos((nextPage * VIDEOS_PER_PAGE) < total); // Check if there are more pages
    } catch (error) {
      console.error("Falha ao carregar mais vídeos:", error);
      setHasMoreVideos(false); // Stop trying to load more on error
    } finally {
      setLoadingMoreVideos(false);
    }
  }, [currentPage, hasMoreVideos, loadingMoreVideos]);


  useEffect(() => {
    // Initial fetch for all global configs
    const fetchAllConfigs = async () => {
      await updateGlobalAdsenseConfig();
      await updateGlobalAppSettings();
      await updateGlobalRewardConfig();
    };
    
    checkAuth();
    fetchAllConfigs();
    loadInitialVideos(); // Initial fetch of videos for the first page
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
          loadMoreVideos={loadMoreVideos} // Pass the load more callback
          hasMoreVideos={hasMoreVideos} // Pass if there are more videos to load
          loadingMoreVideos={loadingMoreVideos} // Pass loading state for more videos
          loadInitialVideos={loadInitialVideos} // Pass the refresh callback for videos
          onUpdateCurrentUser={refreshCurrentUser} // Pass the refresh callback for currentUser
        />
      )}
      {currentRoute === AppRoute.ADMIN && currentUser && currentUser.isAdmin && (
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onUpdateGlobalAdsenseConfig={updateGlobalAdsenseConfig}
          onUpdateGlobalAppSettings={updateGlobalAppSettings}
          onUpdateGlobalRewardConfig={updateGlobalRewardConfig}
          loadInitialVideos={loadInitialVideos} // Pass the refresh callback for videos
          refreshCurrentUser={refreshCurrentUser} // Pass the refresh callback for currentUser
        />
      )}
    </div>
  );
};

export default App;