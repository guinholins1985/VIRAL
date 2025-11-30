import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getAllUsers, updateUserData, deleteUser } from '../../services/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import { PencilIcon, TrashIcon, BanIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon } from '../icons/HeroIcons';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Falha ao buscar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser({ ...user }); // Create a copy for editing
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      const { name, value, type } = e.target;
      setEditingUser({
        ...editingUser,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      setLoading(true);
      try {
        await updateUserData(editingUser);
        setEditingUser(null);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Falha ao atualizar usuário.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBanUser = async (userId: string) => {
    setLoading(true);
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await updateUserData({ ...user, isActive: !user.isActive });
        fetchUsers();
      }
    } catch (err) {
      setError('Falha ao alterar o status do usuário.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetBalance = async (userId: string) => {
    if (window.confirm('Tem certeza de que deseja zerar o saldo deste usuário?')) {
      setLoading(true);
      try {
        const user = users.find(u => u.id === userId);
        if (user) {
          await updateUserData({ ...user, balance: 0 });
          fetchUsers();
        }
      } catch (err) {
        setError('Falha ao zerar o saldo do usuário.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      setLoading(true);
      try {
        await deleteUser(userToDelete);
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (err) {
        setError('Falha ao excluir usuário.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center lg:text-left">Gerenciar Usuários</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">R${user.balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.isAdmin ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <XCircleIcon className="h-5 w-5 text-red-500" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)} title="Editar">
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleBanUser(user.id)} title={user.isActive ? 'Banir' : 'Ativar'}>
                      <BanIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleResetBalance(user.id)} title="Zerar Saldo">
                      <CurrencyDollarIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => confirmDelete(user.id)} title="Excluir">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Editar Usuário: ${editingUser.name}`}
          onConfirm={handleSaveUser}
        >
          <Input label="Nome" id="name" name="name" value={editingUser.name} onChange={handleChange} />
          <Input label="Email" id="email" name="email" type="email" value={editingUser.email} onChange={handleChange} />
          <Input label="Saldo" id="balance" name="balance" type="number" step="0.01" value={editingUser.balance} onChange={handleChange} />
          <div className="mb-4">
            <label htmlFor="isActive" className="flex items-center text-gray-300 text-sm font-bold mb-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={editingUser.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
              />
              Ativo
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="isAdmin" className="flex items-center text-gray-300 text-sm font-bold mb-2">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={editingUser.isAdmin}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
              />
              Admin
            </label>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        onConfirm={handleDeleteUser}
        confirmText="Excluir"
        cancelText="Cancelar"
      >
        <p className="text-gray-300">Tem certeza de que deseja excluir este usuário? Esta ação é irreversível.</p>
      </Modal>
    </div>
  );
};

export default UserManagement;