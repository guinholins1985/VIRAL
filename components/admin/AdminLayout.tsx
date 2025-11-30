import React, { useState } from 'react';
import { User, AdsenseConfig as AdsenseConfigType, AppSettings, RewardConfig } from '../../types'; // Import necessary types
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
  onUpdateGlobalAdsenseConfig: () => Promise<void>; // Callback to update global Adsense config
  onUpdateGlobalAppSettings: () => Promise<void>; // Callback to update global App settings
  onUpdateGlobalRewardConfig: () => Promise<void>; // Callback to update global Reward config
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
}) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.DASHBOARD);

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
          {currentPage === AdminPage.USERS && <UserManagement />}
          {currentPage === AdminPage.VIDEOS && <VideoManagement />}
          {currentPage === AdminPage.REWARDS && <RewardSystemConfig onUpdateGlobalRewardConfig={onUpdateGlobalRewardConfig} />}
          {currentPage === AdminPage.ADSENSE && <AdsenseConfig onUpdateGlobalAdsenseConfig={onUpdateGlobalAdsenseConfig} />}
          {currentPage === AdminPage.SETTINGS && <Settings onUpdateGlobalAppSettings={onUpdateGlobalAppSettings} />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;