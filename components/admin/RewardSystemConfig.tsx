import React, { useState, useEffect } from 'react';
import { RewardConfig, WithdrawalRequest } from '../../types';
import { getRewardConfig, updateRewardConfig, getWithdrawalRequests, updateWithdrawalRequestStatus } from '../../services/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { DollarSignIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon } from '../icons/HeroIcons';

interface RewardSystemConfigProps {
  onUpdateGlobalRewardConfig: () => Promise<void>; // Callback to update global reward config
}

const RewardSystemConfig: React.FC<RewardSystemConfigProps> = ({ onUpdateGlobalRewardConfig }) => {
  const [rewardPerVideo, setRewardPerVideo] = useState<number>(0);
  const [minWatchTimeSeconds, setMinWatchTimeSeconds] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  const fetchConfigAndWithdrawals = async () => {
    setLoading(true);
    try {
      const config: RewardConfig = await getRewardConfig();
      setRewardPerVideo(config.rewardPerVideo);
      setMinWatchTimeSeconds(config.minWatchTimeSeconds);
      const fetchedWithdrawals = await getWithdrawalRequests();
      setWithdrawals(fetchedWithdrawals);
    } catch (err) {
      setError('Falha ao buscar a configuração de recompensas ou saques.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigAndWithdrawals();
  }, []);

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    setConfigSaveSuccess(false);
    setError(null);
    try {
      await updateRewardConfig({ rewardPerVideo, minWatchTimeSeconds });
      setConfigSaveSuccess(true);
      await onUpdateGlobalRewardConfig(); // Notify App.tsx to update global state
      setTimeout(() => setConfigSaveSuccess(false), 3000);
    } catch (err) {
      setError('Falha ao salvar a configuração de recompensas.');
      console.error(err);
    } finally {
      setConfigSaving(false);
    }
  };

  const handleUpdateWithdrawalStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    setError(null);
    try {
      await updateWithdrawalRequestStatus(requestId, status);
      await fetchConfigAndWithdrawals(); // Re-fetch to update list and user balances
    } catch (err) {
      setError('Falha ao atualizar o status do pedido de saque.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando configurações de recompensa...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center lg:text-left">Sistema de Recompensas e Saques</h2>

      {/* Reward Configuration */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <DollarSignIcon className="h-7 w-7 mr-2 text-green-400" />
          Configurações de Recompensa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Recompensa por Vídeo (R$)"
            id="reward-per-video"
            type="number"
            step="0.01"
            value={rewardPerVideo}
            onChange={(e) => setRewardPerVideo(parseFloat(e.target.value))}
          />
          <Input
            label="Tempo Mínimo de Exibição (segundos)"
            id="min-watch-time"
            type="number"
            value={minWatchTimeSeconds}
            onChange={(e) => setMinWatchTimeSeconds(parseInt(e.target.value))}
          />
        </div>
        <Button onClick={handleSaveConfig} disabled={configSaving}>
          {configSaving ? <LoadingSpinner size="sm" color="border-white" /> : 'Salvar Configurações'}
        </Button>
        {configSaveSuccess && <p className="text-green-400 text-sm mt-2">Configurações salvas com sucesso!</p>}
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <DocumentTextIcon className="h-7 w-7 mr-2 text-blue-400" />
          Pedidos de Saque
        </h3>
        {withdrawals.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum pedido de saque pendente.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{req.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">R${req.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{req.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status === 'approved' ? 'Aprovado' : req.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(req.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {req.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button variant="primary" size="sm" onClick={() => handleUpdateWithdrawalStatus(req.id, 'approved')} title="Aprovar">
                            <CheckCircleIcon className="h-5 w-5" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleUpdateWithdrawalStatus(req.id, 'rejected')} title="Recusar">
                            <XCircleIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardSystemConfig;