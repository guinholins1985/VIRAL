import React, { useState } from 'react';
import { User, AdsenseConfig as AdsenseConfigType, AppSettings, RewardConfig } from '../../types';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import VideoManagement from './VideoManagement';
import RewardSystemConfig from './RewardSystemConfig';
import AdsenseConfig from './AdsenseConfig';
import Settings from './Settings';
import Button from '../shared/Button';
import { LogoutIcon } from '../icons/HeroIcons';

interface AdminLayoutProps {
  currentUser: User;
  onLogout: () => void;
  onUpdateGlobalAdsenseConfig: () => Promise<void>;
  onUpdateGlobalAppSettings: () => Promise<void>;
  onUpdateGlobalRewardConfig: () => Promise<void>;
  loadInitialVideos: () => Promise<void>; // Callback to trigger global video list refresh (for user feed) (renamed from refreshVideos)
  refreshCurrentUser: () => Promise<void>; // New prop: callback to refresh global currentUser state
}

enum AdminPage {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  VIDEOS = 'videos',
  REWARDS = 'rewards',
  ADSENSE = 'adsense',
  SETTINGS = 'settings',
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  onUpdateGlobalAdsenseConfig,
  onUpdateGlobalAppSettings,
  onUpdateGlobalRewardConfig,
  loadInitialVideos, // Renamed from refreshVideos
  refreshCurrentUser, // Destructure new prop
}) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.DASHBOARD);
  // State to force refresh of admin video list when changes happen elsewhere in admin
  const [adminVideosRefreshKey, setAdminVideosRefreshKey] = useState(0);

  const onAdminVideosRefreshTriggered = () => {
    setAdminVideosRefreshKey(prev => prev + 1);
  };


  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar onNavigate={setCurrentPage} currentPage={currentPage} />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800 shadow-md sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Painel Admin
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Olá, {currentUser.name}</span>
            <Button onClick={onLogout} variant="secondary" size="sm">
              <LogoutIcon className="h-5 w-5 mr-2" /> Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {currentPage === AdminPage.DASHBOARD && <AdminDashboard />}
          {currentPage === AdminPage.USERS && (
            <UserManagement 
              refreshCurrentUser={refreshCurrentUser} // Pass the refresh callback
              currentUser={currentUser} // Pass currentUser to prevent admin from deleting self
            />
          )}
          {currentPage === AdminPage.VIDEOS && (
            <VideoManagement
              loadInitialVideos={loadInitialVideos} // Pass the refresh callback (renamed from refreshVideos)
              adminVideosRefreshKey={adminVideosRefreshKey} // Pass the refresh key
              onAdminVideosRefreshTriggered={onAdminVideosRefreshTriggered} // Pass the trigger
            />
          )}
          {currentPage === AdminPage.REWARDS && (
            <RewardSystemConfig 
              onUpdateGlobalRewardConfig={onUpdateGlobalRewardConfig} 
              refreshCurrentUser={refreshCurrentUser} // Pass the refresh callback
            />
          )}
          {currentPage === AdminPage.ADSENSE && <AdsenseConfig onUpdateGlobalAdsenseConfig={onUpdateGlobalAdsenseConfig} />}
          {currentPage === AdminPage.SETTINGS && (
            <Settings
              onUpdateGlobalAppSettings={onUpdateGlobalAppSettings}
              loadInitialVideos={loadInitialVideos} // Pass the refresh callback (renamed from refreshVideos)
              onAdminVideosRefreshTriggered={onAdminVideosRefreshTriggered} // Pass the trigger
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;