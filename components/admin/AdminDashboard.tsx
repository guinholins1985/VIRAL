import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { AdminDashboardData, ChartDataPoint } from '../../types';
import { getAdminDashboardData } from '../../services/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import { UsersIcon, VideoIcon, DollarSignIcon, ChartBarIcon } from '../icons/HeroIcons';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dashboardData = await getAdminDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Falha ao buscar dados do painel.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando dados do painel...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-400 text-center p-8">Nenhum dado disponível.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center lg:text-left">Dashboard Geral</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
          <UsersIcon className="h-10 w-10 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Total de Usuários</p>
            <p className="text-3xl font-bold text-white">{data.totalUsers.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
          <VideoIcon className="h-10 w-10 text-purple-400" />
          <div>
            <p className="text-gray-400 text-sm">Vídeos Assistidos</p>
            <p className="text-3xl font-bold text-white">{data.totalVideosWatched.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
          <DollarSignIcon className="h-10 w-10 text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Saldo a Pagar</p>
            <p className="text-3xl font-bold text-white">R${data.totalPendingPayout.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
          <ChartBarIcon className="h-10 w-10 text-orange-400" />
          <div>
            <p className="text-gray-400 text-sm">Usuários Ativos</p>
            <p className="text-3xl font-bold text-white">{data.activeUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Crescimento Diário (Usuários e Vídeos)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="date" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a202c', border: 'none' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Line type="monotone" dataKey="users" stroke="#60a5fa" name="Usuários" />
              <Line type="monotone" dataKey="videos" stroke="#a78bfa" name="Vídeos Assistidos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Crescimento Mensal (Usuários)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="month" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a202c', border: 'none' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="users" fill="#3b82f6" name="Usuários" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;