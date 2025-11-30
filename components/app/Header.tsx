import React from 'react';
import { User } from '../../types';
import { UserIcon, LogoutIcon, ChartBarIcon, VideoIcon } from '../icons/HeroIcons';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onNavigate: (page: 'feed' | 'profile' | 'rewards') => void;
  currentPage: 'feed' | 'profile' | 'rewards';
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700 shadow-lg px-4 py-3 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        CASHVIRAL
      </h1>
      <nav className="flex items-center space-x-6">
        <button
          onClick={() => onNavigate('feed')}
          className={`p-2 rounded-full transition-colors duration-200 ${
            currentPage === 'feed' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          aria-label="Feed de Vídeos"
        >
          <VideoIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onNavigate('rewards')}
          className={`p-2 rounded-full transition-colors duration-200 ${
            currentPage === 'rewards' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          aria-label="Recompensas"
        >
          <ChartBarIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`p-2 rounded-full transition-colors duration-200 ${
            currentPage === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          aria-label="Perfil do Usuário"
        >
          <UserIcon className="h-6 w-6" />
        </button>
        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-red-400 p-2 transition-colors duration-200 rounded-full hover:bg-gray-700"
          aria-label="Sair"
        >
          <LogoutIcon className="h-6 w-6" />
        </button>
      </nav>
    </header>
  );
};

export default Header;