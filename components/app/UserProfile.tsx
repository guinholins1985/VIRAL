import React, { useState, useEffect, useCallback } from 'react';
import { User, WithdrawalRequest } from '../../types';
import { createWithdrawalRequest, getWithdrawalRequests } from '../../services/apiService';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import LoadingSpinner from '../shared/LoadingSpinner';
import { CreditCardIcon, ChartBarIcon } from '../icons/HeroIcons';

interface UserProfileProps {
  currentUser: User;
  onUserUpdate: (user: User) => void;
  onUpdatePreferences: (preferences: string[]) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onUserUpdate, onUpdatePreferences }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalRequest['method']>('PIX');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userWithdrawalRequests, setUserWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [preferencesInput, setPreferencesInput] = useState<string>('');

  const fetchWithdrawalRequests = useCallback(async () => {
    const requests = await getWithdrawalRequests();
    setUserWithdrawalRequests(requests.filter(req => req.userId === currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, [fetchWithdrawalRequests]);

  const handleRequestWithdrawal = async () => {
    setError(null);
    setSuccessMessage(null);
    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, insira um valor válido.');
      return;
    }
    if (amount > currentUser.balance) {
      setError('Saldo insuficiente.');
      return;
    }

    setIsLoading(true);
    try {
      await createWithdrawalRequest(currentUser.id, amount, withdrawalMethod);
      setSuccessMessage('Solicitação de saque enviada com sucesso!');
      onUserUpdate({ ...currentUser, balance: parseFloat((currentUser.balance - amount).toFixed(2)) }); // Optimistically update balance
      setWithdrawalAmount('');
      setShowWithdrawalModal(false);
      fetchWithdrawalRequests(); // Refresh requests
    } catch (err) {
      setError((err as Error).message || 'Erro ao solicitar saque.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPreference = () => {
    if (preferencesInput.trim() && !currentUser.preferences.includes(preferencesInput.trim().toLowerCase())) {
      const newPreferences = [...currentUser.preferences, preferencesInput.trim().toLowerCase()];
      onUpdatePreferences(newPreferences);
      setPreferencesInput('');
    }
  };

  const handleRemovePreference = (prefToRemove: string) => {
    const newPreferences = currentUser.preferences.filter(pref => pref !== prefToRemove);
    onUpdatePreferences(newPreferences);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Meu Perfil</h2>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <img
            src={`https://picsum.photos/100/100?random=${currentUser.id}`}
            alt="Avatar do Usuário"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-2">{currentUser.name}</h3>
          <p className="text-gray-400 mb-4">{currentUser.email}</p>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg inline-block shadow-md">
            <p className="text-lg font-bold text-white">Saldo Atual: <span className="text-green-300">R${currentUser.balance.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="mt-8">
            <h4 className="text-xl font-semibold text-white mb-3 flex items-center"><CreditCardIcon className="h-6 w-6 mr-2 text-blue-400" /> Opções de Saque</h4>
            <Button fullWidth onClick={() => setShowWithdrawalModal(true)} className="py-3 text-lg">
                Solicitar Saque
            </Button>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-purple-400" /> Minhas Preferências
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentUser.preferences.map((pref, index) => (
              <span key={index} className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center">
                {pref}
                <button onClick={() => handleRemovePreference(pref)} className="ml-2 text-white hover:text-gray-200 text-lg leading-none focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="preferences-input"
              placeholder="Adicionar nova preferência"
              value={preferencesInput}
              onChange={(e) => setPreferencesInput(e.target.value)}
              className="flex-grow bg-gray-700 border-gray-600 text-gray-200"
            />
            <Button onClick={handleAddPreference} variant="secondary">Adicionar</Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h4 className="text-xl font-semibold text-white mb-4">Histórico de Saques</h4>
        {userWithdrawalRequests.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhuma solicitação de saque ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {userWithdrawalRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">R${req.amount.toFixed(2)}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        title="Solicitar Saque"
        onConfirm={handleRequestWithdrawal}
        confirmText="Confirmar Saque"
      >
        <p className="mb-4 text-gray-300">Seu saldo atual: <span className="font-semibold text-green-400">R${currentUser.balance.toFixed(2)}</span></p>
        <Input
          id="withdrawal-amount"
          label="Valor do Saque (R$)"
          type="number"
          step="0.01"
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value)}
          error={error || undefined}
          className="mb-4"
        />
        <div className="mb-4">
          <label htmlFor="withdrawal-method" className="block text-gray-300 text-sm font-bold mb-2">
            Método de Pagamento
          </label>
          <select
            id="withdrawal-method"
            value={withdrawalMethod}
            onChange={(e) => setWithdrawalMethod(e.target.value as WithdrawalRequest['method'])}
            className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          >
            <option value="PIX">PIX</option>
            <option value="MercadoPago">Mercado Pago</option>
            <option value="PagBank">PagBank</option>
          </select>
        </div>
        {isLoading && <LoadingSpinner size="sm" className="mx-auto" />}
        {successMessage && <p className="text-green-400 text-center mt-3">{successMessage}</p>}
      </Modal>
    </div>
  );
};

export default UserProfile;