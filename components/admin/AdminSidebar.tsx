import React from 'react';
import {
  HomeIcon,
  UsersIcon,
  VideoIcon,
  DollarSignIcon,
  CogIcon,
  ChartPieIcon,
} from '../icons/HeroIcons';

interface AdminSidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, page: 'dashboard' },
    { name: 'Gerenciar Usuários', icon: UsersIcon, page: 'users' },
    { name: 'Gerenciar Vídeos', icon: VideoIcon, page: 'videos' },
    { name: 'Recompensas e Saques', icon: DollarSignIcon, page: 'rewards' },
    { name: 'AdSense', icon: ChartPieIcon, page: 'adsense' },
    { name: 'Configurações', icon: CogIcon, page: 'settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          CASHVIRAL
        </h2>
        <p className="text-sm text-gray-500 mt-1">Painel Administrativo</p>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.page} className="mb-2">
              <button
                onClick={() => onNavigate(item.page)}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${currentPage === item.page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;