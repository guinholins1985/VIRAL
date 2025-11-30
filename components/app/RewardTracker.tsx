import React from 'react'; // Removed useState, useEffect as config is now a prop
import { User, RewardConfig } from '../../types'; // Import RewardConfig type
import { DollarSignIcon, VideoIcon, GiftIcon, CheckCircleIcon, XCircleIcon } from '../icons/HeroIcons';
import LoadingSpinner from '../shared/LoadingSpinner';

interface RewardTrackerProps {
  currentUser: User;
  rewardConfig: RewardConfig; // Accept rewardConfig as prop
}

const RewardTracker: React.FC<RewardTrackerProps> = ({ currentUser, rewardConfig }) => {
  // Removed local state and useEffect for rewardConfig as it's now passed as a prop

  if (!rewardConfig) { // Check if prop is still loading from parent
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando recompensas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Minhas Recompensas</h2>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-xl mb-8 text-center">
        <p className="text-lg font-medium text-white mb-2">Seu Saldo Atual</p>
        <p className="text-5xl font-extrabold text-white">R${currentUser.balance.toFixed(2)}</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <DollarSignIcon className="h-7 w-7 mr-2 text-green-400" />
          Como Funciona o Sistema de Recompensas
        </h3>
        <div className="space-y-4 text-gray-300">
          <p className="flex items-center">
            <VideoIcon className="h-6 w-6 mr-2 text-blue-400" />
            Assista a qualquer vídeo na plataforma por no mínimo{' '}
            <span className="font-semibold text-white ml-1 mr-1">{rewardConfig.minWatchTimeSeconds} segundos</span>.
          </p>
          <p className="flex items-center">
            <GiftIcon className="h-6 w-6 mr-2 text-purple-400" />
            A cada vídeo qualificado, você ganha{' '}
            <span className="font-semibold text-white ml-1">R${rewardConfig.rewardPerVideo.toFixed(2)}</span>.
          </p>
          <p>
            Acumule saldo e solicite o saque para sua conta PIX, Mercado Pago ou PagBank através da página de Perfil.
            Fique atento às missões diárias e bônus por convite para ganhar ainda mais!
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4">Missões Diárias e Bônus</h3>
        <p className="text-gray-300 mb-4">
          Complete missões diárias para ganhar bônus extras e convide amigos para CASHVIRAL para receber recompensas adicionais.
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />
            Assista a 10 vídeos hoje: +R$1.00
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />
            Convide um amigo: +R$0.50 (quando ele assistir 5 vídeos)
          </li>
          <li className="flex items-center text-yellow-400">
            <XCircleIcon className="h-5 w-5 mr-2" />
            Compartilhe um vídeo (em breve)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RewardTracker;