import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import LoadingSpinner from '../shared/LoadingSpinner';
import { CogIcon, AdjustmentsIcon, LinkIcon, VideoIcon } from '../icons/HeroIcons';
import { getAppSettings, updateAppSettings, syncVimeoAccount } from '../../services/apiService';
import { AppSettings } from '../../types';

interface SettingsProps {
  onUpdateGlobalAppSettings: () => Promise<void>; // Callback to update global app settings
}

const Settings: React.FC<SettingsProps> = ({ onUpdateGlobalAppSettings }) => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'CASHVIRAL',
    appLogoUrl: 'https://picsum.photos/50/50?random=logo',
    privacyPolicyUrl: '#',
    termsOfServiceUrl: '#',
    youtubeApiKey: 'YOUR_YOUTUBE_API_KEY',
    vimeoApiKey: 'YOUR_VIMEO_API_KEY',
    geminiApiKey: 'YOUR_GEMINI_API_KEY',
    vimeoAccessToken: '',
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vimeoSyncLoading, setVimeoSyncLoading] = useState(false);
  const [vimeoSyncSuccess, setVimeoSyncSuccess] = useState<boolean | null>(null);
  const [vimeoSyncError, setVimeoSyncError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const fetchedSettings = await getAppSettings();
        setAppSettings(fetchedSettings);
      } catch (err) {
        setError('Falha ao buscar as configurações.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await updateAppSettings(appSettings);
      setSaveSuccess(true);
      await onUpdateGlobalAppSettings(); // Notify App.tsx to update global state
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Falha ao salvar as configurações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncVimeo = async () => {
    setVimeoSyncLoading(true);
    setVimeoSyncSuccess(null);
    setVimeoSyncError(null);

    try {
      if (!appSettings.vimeoAccessToken) {
        throw new Error('Por favor, forneça um Token de Acesso Vimeo.');
      }
      const success = await syncVimeoAccount(appSettings.vimeoAccessToken);
      setVimeoSyncSuccess(success);
      if (!success) {
        setVimeoSyncError('A sincronização da conta Vimeo falhou. Por favor, verifique o token.');
      }
      setTimeout(() => setVimeoSyncSuccess(null), 5000);
    } catch (err) {
      setVimeoSyncSuccess(false);
      setVimeoSyncError((err as Error).message || 'Falha ao sincronizar a conta Vimeo.');
      console.error(err);
    } finally {
      setVimeoSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center lg:text-left">Configurações Gerais do Aplicativo</h2>

      {/* Basic App Info */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <CogIcon className="h-7 w-7 mr-2 text-blue-400" />
          Informações Básicas do App
        </h3>
        <Input
          label="Nome do Aplicativo"
          id="appName"
          name="appName"
          value={appSettings.appName}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="URL do Logo do App"
          id="appLogoUrl"
          name="appLogoUrl"
          value={appSettings.appLogoUrl}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="URL da Política de Privacidade"
          id="privacyPolicyUrl"
          name="privacyPolicyUrl"
          value={appSettings.privacyPolicyUrl}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="URL dos Termos de Serviço"
          id="termsOfServiceUrl"
          name="termsOfServiceUrl"
          value={appSettings.termsOfServiceUrl}
          onChange={handleChange}
          className="mb-4"
        />
      </div>

      {/* API Keys */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <AdjustmentsIcon className="h-7 w-7 mr-2 text-purple-400" />
          Chaves de API
        </h3>
        <p className="text-gray-400 mb-4">
          Estas chaves são cruciais para a funcionalidade do aplicativo. Manuseie com cuidado.
          <br/>(Para esta demo, as chaves são mockadas e apenas simuladas no frontend.)
        </p>
        <Input
          label="Chave da API de Dados do YouTube"
          id="youtubeApiKey"
          name="youtubeApiKey"
          type="password"
          value={appSettings.youtubeApiKey}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Chave da API Vimeo"
          id="vimeoApiKey"
          name="vimeoApiKey"
          type="password"
          value={appSettings.vimeoApiKey}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Chave da API Google Gemini"
          id="geminiApiKey"
          name="geminiApiKey"
          type="password"
          value={appSettings.geminiApiKey}
          onChange={handleChange}
          className="mb-4"
        />
      </div>

      {/* Vimeo Account Synchronization */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <LinkIcon className="h-7 w-7 mr-2 text-green-400" />
          Sincronização de Conta Vimeo
        </h3>
        <p className="text-gray-400 mb-4">
          Conecte sua conta Vimeo para gerenciar vídeos diretamente.
          Insira seu token de acesso pessoal Vimeo e clique em sincronizar.
          (Isso é uma simulação para fins de demonstração.)
        </p>
        <Input
          label="Token de Acesso Vimeo"
          id="vimeoAccessToken"
          name="vimeoAccessToken"
          type="password"
          value={appSettings.vimeoAccessToken || ''}
          onChange={handleChange}
          className="mb-4"
          placeholder="Seu token de acesso pessoal Vimeo"
        />
        <Button onClick={handleSyncVimeo} disabled={vimeoSyncLoading} className="py-2.5">
          {vimeoSyncLoading ? <LoadingSpinner size="sm" color="border-white" /> : 'Sincronizar Conta Vimeo'}
        </Button>
        {vimeoSyncSuccess === true && <p className="text-green-400 text-sm mt-2 flex items-center"><VideoIcon className="h-5 w-5 mr-1"/> Sincronização de conta Vimeo bem-sucedida!</p>}
        {vimeoSyncSuccess === false && vimeoSyncError && <p className="text-red-500 text-sm mt-2">{vimeoSyncError}</p>}
      </div>

      {/* Save Button */}
      <Button onClick={handleSaveSettings} fullWidth className="py-3 text-lg" disabled={loading}>
        {loading ? <LoadingSpinner size="sm" color="border-white" /> : 'Salvar Todas as Configurações'}
      </Button>
      {saveSuccess && <p className="text-green-400 text-center mt-3">Configurações salvas com sucesso!</p>}
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
    </div>
  );
};

export default Settings;