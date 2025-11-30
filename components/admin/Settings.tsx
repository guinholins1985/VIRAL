import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import LoadingSpinner from '../shared/LoadingSpinner';
import { CogIcon, AdjustmentsIcon, LinkIcon, VideoIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon } from '../icons/HeroIcons';
import { getAppSettings, updateAppSettings, syncVimeoAccount, fetchVimeoUserVideos, addSingleVimeoVideo } from '../../services/apiService';
import { AppSettings, VimeoVideoMetadata } from '../../types';

interface SettingsProps {
  onUpdateGlobalAppSettings: () => Promise<void>;
  loadInitialVideos: () => Promise<void>; // Updated prop name to reflect global refresh (renamed from refreshVideos)
  onAdminVideosRefreshTriggered: () => void; // New prop for admin video list refresh
}

const Settings: React.FC<SettingsProps> = ({ onUpdateGlobalAppSettings, loadInitialVideos, onAdminVideosRefreshTriggered }) => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'CASHVIRAL',
    appLogoUrl: 'https://picsum.photos/50/50?random=logo',
    privacyPolicyUrl: '#',
    termsOfServiceUrl: '#',
    vimeoApiKey: 'YOUR_VIMEO_API_KEY',
    geminiApiKey: 'YOUR_GEMINI_API_KEY',
    vimeoUserId: '',
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vimeoSyncLoading, setVimeoSyncLoading] = useState(false);
  const [vimeoSyncSuccess, setVimeoSyncSuccess] = useState<boolean | null>(null);
  const [vimeoSyncError, setVimeoSyncError] = useState<string | null>(null);

  const [availableVimeoVideos, setAvailableVimeoVideos] = useState<VimeoVideoMetadata[]>([]);
  const [isFetchingVimeoVideos, setIsFetchingVimeoVideos] = useState(false);
  const [fetchVimeoError, setFetchVimeoError] = useState<string | null>(null);
  const [manualAddLoadingId, setManualAddLoadingId] = useState<string | null>(null);


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
      await onUpdateGlobalAppSettings();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Falha ao salvar as configurações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateVimeoCredentials = (): boolean => {
    if (!appSettings.vimeoUserId || appSettings.vimeoUserId.trim() === '') {
      setVimeoSyncError('Por favor, forneça um ID de Usuário Vimeo para sincronizar.');
      return false;
    }
    setVimeoSyncError(null);
    return true;
  };

  const handleFetchVimeoVideos = async () => {
    setAvailableVimeoVideos([]);
    setIsFetchingVimeoVideos(true);
    setFetchVimeoError(null);
    setVimeoSyncSuccess(null); // Reset success message on new fetch

    if (!validateVimeoCredentials()) {
      setIsFetchingVimeoVideos(false);
      return;
    }

    try {
      // Esta função simula a "extração de todos os vídeos da conta Vimeo sincronizada"
      // e os lista para pré-visualização.
      const videos = await fetchVimeoUserVideos(appSettings.vimeoUserId!);
      setAvailableVimeoVideos(videos);
      setVimeoSyncSuccess(true); // Indica sucesso da busca, não necessariamente da sincronização
    } catch (err) {
      setFetchVimeoError((err as Error).message || 'Falha ao buscar vídeos da conta Vimeo.');
      setVimeoSyncSuccess(false);
      console.error(err);
    } finally {
      setIsFetchingVimeoVideos(false);
    }
  };

  const handleSyncVimeoAutomatic = async () => {
    setVimeoSyncLoading(true);
    setVimeoSyncSuccess(null);
    setVimeoSyncError(null);

    if (!validateVimeoCredentials()) {
      setVimeoSyncLoading(false);
      return;
    }

    try {
      // Esta função "extrai todos os vídeos da conta sincronizada vimeo e salva todos"
      // sobrescrevendo a lista global de vídeos.
      await syncVimeoAccount(appSettings.vimeoUserId!);
      setVimeoSyncSuccess(true);
      setVimeoSyncError('Sincronização de conta Vimeo bem-sucedida! Vídeos da conta foram adicionados/atualizados.');
      await loadInitialVideos(); // Aciona o refresh global do feed de vídeos (App.tsx)
      await onAdminVideosRefreshTriggered(); // Aciona o refresh da lista do admin (VideoManagement.tsx)
      setAvailableVimeoVideos([]); // Limpa os vídeos pré-buscados após a sincronização automática
      setTimeout(() => {setVimeoSyncSuccess(null); setVimeoSyncError(null);}, 5000);
    } catch (err) {
      setVimeoSyncSuccess(false);
      setVimeoSyncError((err as Error).message || 'Falha ao sincronizar a conta Vimeo.');
      console.error(err);
    } finally {
      setVimeoSyncLoading(false);
    }
  };

  const handleAddManualVimeoVideo = async (video: VimeoVideoMetadata) => {
    setManualAddLoadingId(video.id);
    setVimeoSyncError(null);
    setVimeoSyncSuccess(null); // Reset success message on new manual add

    try {
      await addSingleVimeoVideo(video);
      await loadInitialVideos(); // Aciona o refresh global do feed de vídeos (App.tsx)
      await onAdminVideosRefreshTriggered(); // Aciona o refresh da lista do admin (VideoManagement.tsx)
      setVimeoSyncSuccess(true);
      setVimeoSyncError('Vídeo Vimeo adicionado com sucesso!'); // Usa mensagem de sucesso aqui
      // Não é necessário limpar availableVimeoVideos, apenas mostrar sucesso para este vídeo
      setTimeout(() => {setVimeoSyncSuccess(null); setVimeoSyncError(null);}, 3000);
    } catch (err) {
      setVimeoSyncSuccess(false);
      setVimeoSyncError((err as Error).message || 'Falha ao adicionar vídeo manualmente.');
      console.error(err);
    } finally {
      setManualAddLoadingId(null);
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
          Insira o ID do usuário Vimeo para sincronizar seus vídeos.
          (Isso é uma simulação para fins de demonstração.)
        </p>
        <Input
          label="ID de Usuário Vimeo"
          id="vimeoUserId"
          name="vimeoUserId"
          type="text"
          value={appSettings.vimeoUserId || ''}
          onChange={handleChange}
          className="mb-4"
          placeholder="Ex: 250829792"
        />
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-6">
          <Button onClick={handleFetchVimeoVideos} disabled={isFetchingVimeoVideos} className="md:flex-grow py-2.5">
            {isFetchingVimeoVideos ? <LoadingSpinner size="sm" color="border-white" /> : 'Buscar Vídeos da Conta'}
          </Button>
          <Button
            onClick={handleSyncVimeoAutomatic}
            disabled={vimeoSyncLoading}
            variant="primary"
            className="md:flex-grow py-2.5"
          >
            {vimeoSyncLoading ? <LoadingSpinner size="sm" color="border-white" /> : 'Sincronizar Todos (Automático - Substitui Existentes)'}
          </Button>
        </div>

        {(vimeoSyncSuccess !== null || vimeoSyncError) && ( // Mostra o status geral da sincronização
          <p className={`text-sm mt-2 flex items-center ${vimeoSyncSuccess ? 'text-green-400' : 'text-red-500'}`}>
            {vimeoSyncSuccess ? <CheckCircleIcon className="h-5 w-5 mr-1"/> : <XCircleIcon className="h-5 w-5 mr-1"/>}
            {vimeoSyncError || (vimeoSyncSuccess ? 'Operação concluída com sucesso!' : 'Falha na operação.')}
          </p>
        )}


        {/* Display Available Vimeo Videos */}
        {isFetchingVimeoVideos && (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner size="sm" /> <span className="ml-2 text-gray-400">Buscando vídeos...</span>
          </div>
        )}
        {fetchVimeoError && <p className="text-red-500 text-sm mt-2">{fetchVimeoError}</p>}

        {availableVimeoVideos.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h4 className="text-lg font-bold text-white mb-3">
              {/* Exibe a quantidade exata de vídeos encontrados */}
              {availableVimeoVideos.length} Vídeos disponíveis para sincronizar:
            </h4>
            <div className="max-h-60 overflow-y-auto pr-2">
              <ul className="space-y-3">
                {availableVimeoVideos.map((video) => (
                  <li key={video.id} className="flex items-center bg-gray-600 p-2 rounded-md shadow-sm">
                    <img src={video.thumbnail} alt={video.title} className="w-16 h-9 object-cover rounded mr-3" />
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-white truncate">{video.title}</p>
                      <p className="text-xs text-gray-300">{Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddManualVimeoVideo(video)}
                      disabled={manualAddLoadingId === video.id}
                      title="Adicionar Vídeo Individualmente"
                      className="whitespace-nowrap ml-2"
                    >
                      {manualAddLoadingId === video.id ? <LoadingSpinner size="sm" color="border-white" /> : <PlusCircleIcon className="h-4 w-4" />}
                      <span className="sr-only">Adicionar</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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