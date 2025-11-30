import React, { useState, useEffect } from 'react';
import { AdsenseConfig, AdBlock, ChartDataPoint } from '../../types';
import { getAdsenseConfig, updateAdsenseConfig } from '../../services/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { ChartBarIcon, CreditCardIcon, CogIcon, PlusCircleIcon, TrashIcon } from '../icons/HeroIcons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AD_PLACEMENT_OPTIONS } from '../../constants'; // Import predefined ad placement options

interface AdsenseConfigProps {
  onUpdateGlobalAdsenseConfig: () => Promise<void>; // Callback to update global Adsense config
}

const AdsenseConfig: React.FC<AdsenseConfigProps> = ({ onUpdateGlobalAdsenseConfig }) => {
  const [adsenseConfig, setAdsenseConfig] = useState<AdsenseConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const config = await getAdsenseConfig();
        setAdsenseConfig(config);
      } catch (err) {
        setError('Falha ao buscar a configuração do AdSense.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (adsenseConfig) {
      const { name, value } = e.target;
      setAdsenseConfig({
        ...adsenseConfig,
        [name]: value,
      });
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (adsenseConfig) {
      const updatedCodes = [...adsenseConfig.verificationCodes];
      updatedCodes[index] = value;
      setAdsenseConfig({ ...adsenseConfig, verificationCodes: updatedCodes });
    }
  };

  const handleAddVerificationCode = () => {
    if (adsenseConfig) {
      setAdsenseConfig({
        ...adsenseConfig,
        verificationCodes: [...adsenseConfig.verificationCodes, ''],
      });
    }
  };

  const handleRemoveVerificationCode = (index: number) => {
    if (adsenseConfig) {
      const updatedCodes = adsenseConfig.verificationCodes.filter((_, i) => i !== index);
      setAdsenseConfig({ ...adsenseConfig, verificationCodes: updatedCodes });
    }
  };

  const handleAdBlockChange = (index: number, field: keyof AdBlock, value: string | boolean) => {
    if (adsenseConfig) {
      const updatedAdBlocks = [...adsenseConfig.adBlocks];
      updatedAdBlocks[index] = {
        ...updatedAdBlocks[index],
        [field]: value,
      };
      setAdsenseConfig({ ...adsenseConfig, adBlocks: updatedAdBlocks });
    }
  };

  const handleAddAdBlock = () => {
    if (adsenseConfig) {
      const newAdBlock: AdBlock = {
        id: `ad${Date.now()}`,
        name: `Novo Bloco ${adsenseConfig.adBlocks.length + 1}`,
        code: '<!-- Seu novo código de anúncio aqui -->',
        active: false,
        placement: AD_PLACEMENT_OPTIONS[0].value, // Default to first option's value
      };
      setAdsenseConfig({
        ...adsenseConfig,
        adBlocks: [...adsenseConfig.adBlocks, newAdBlock],
      });
    }
  };

  const handleRemoveAdBlock = (id: string) => {
    if (adsenseConfig) {
      const updatedAdBlocks = adsenseConfig.adBlocks.filter((block) => block.id !== id);
      setAdsenseConfig({ ...adsenseConfig, adBlocks: updatedAdBlocks });
    }
  };


  const handleSaveConfig = async () => {
    if (adsenseConfig) {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);
      try {
        await updateAdsenseConfig(adsenseConfig);
        setSaveSuccess(true);
        await onUpdateGlobalAdsenseConfig(); // Notify App.tsx to update global state
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        setError('Falha ao salvar a configuração do AdSense.');
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando configurações do AdSense...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!adsenseConfig) {
    return <div className="text-gray-400 text-center p-8">Nenhuma configuração do AdSense encontrada.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center lg:text-left">Configurações do Google AdSense</h2>

      {/* General Settings */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <CogIcon className="h-7 w-7 mr-2 text-blue-400" />
          Configurações Gerais
        </h3>
        <Input
          label="ID do Editor AdSense (Pub-ID)"
          id="adsenseId"
          name="adsenseId"
          value={adsenseConfig.adsenseId}
          onChange={handleChange}
          placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          className="mb-4"
        />

        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Códigos de Verificação de Site
          </label>
          {adsenseConfig.verificationCodes.map((code, index) => (
            <div key={index} className="flex items-center mb-2 space-x-2">
              <textarea
                value={code}
                onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                rows={2}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 placeholder-gray-400"
                placeholder="&lt;meta name=&quot;google-adsense-account&quot; content=&quot;ca-pub-XXXXXXXXXXXXXXXX&quot;&gt;"
              ></textarea>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveVerificationCode(index)}
                title="Remover Código"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddVerificationCode} className="mt-2">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Adicionar Mais Código
          </Button>
        </div>
      </div>

      {/* Ad Blocks Management */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="2xl font-bold text-white flex items-center">
            <CreditCardIcon className="h-7 w-7 mr-2 text-green-400" />
            Gerenciar Blocos de Anúncios
          </h3>
          <Button onClick={handleAddAdBlock} variant="primary">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Adicionar Bloco
          </Button>
        </div>
        {adsenseConfig.adBlocks.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum bloco de anúncio configurado.</p>
        ) : (
          adsenseConfig.adBlocks.map((adBlock, index) => (
            <div key={adBlock.id} className="bg-gray-700 p-4 rounded-lg mb-4 last:mb-0 border border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-white">{adBlock.name} ({AD_PLACEMENT_OPTIONS.find(opt => opt.value === adBlock.placement)?.label || 'Área Personalizada'})</h4>
                <Button variant="danger" size="sm" onClick={() => handleRemoveAdBlock(adBlock.id)} title="Remover Bloco">
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>
              <Input
                label="Nome do Bloco"
                id={`ad-name-${adBlock.id}`}
                value={adBlock.name}
                onChange={(e) => handleAdBlockChange(index, 'name', e.target.value)}
                className="mb-3"
              />
              <div className="mb-4">
                <label htmlFor={`ad-placement-${adBlock.id}`} className="block text-gray-300 text-sm font-bold mb-2">
                  Posicionamento (Área do Anúncio)
                </label>
                <select
                  id={`ad-placement-${adBlock.id}`}
                  name="placement"
                  value={adBlock.placement}
                  onChange={(e) => handleAdBlockChange(index, 'placement', e.target.value)}
                  className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                >
                  {AD_PLACEMENT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Código do Bloco de Anúncio
                </label>
                <textarea
                  value={adBlock.code}
                  onChange={(e) => handleAdBlockChange(index, 'code', e.target.value)}
                  rows={4}
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-600 placeholder-gray-400"
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`ad-active-${adBlock.id}`}
                  checked={adBlock.active}
                  onChange={(e) => handleAdBlockChange(index, 'active', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-500 bg-gray-600"
                />
                <label htmlFor={`ad-active-${adBlock.id}`} className="text-gray-300 text-sm font-bold">
                  Ativar este bloco de anúncio
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Revenue Reports */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <ChartBarIcon className="h-7 w-7 mr-2 text-purple-400" />
          Relatórios de Receita
        </h3>
        {adsenseConfig.revenueReports && adsenseConfig.revenueReports.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adsenseConfig.revenueReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="date" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a202c', border: 'none' }}
                itemStyle={{ color: '#ffffff' }}
                formatter={(value: number, name: string) => {
                    if (name === 'revenue') return `R$${value.toFixed(2)}`;
                    return value;
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Receita" />
              <Line type="monotone" dataKey="clicks" stroke="#3b82f6" name="Cliques" />
              <Line type="monotone" dataKey="impressions" stroke="#facc15" name="Impressões" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center">Nenhum dado de relatório de receita disponível.</p>
        )}
      </div>

      <Button onClick={handleSaveConfig} fullWidth className="py-3 text-lg" disabled={saving}>
        {saving ? <LoadingSpinner size="sm" color="border-white" /> : 'Salvar Todas as Configurações AdSense'}
      </Button>
      {saveSuccess && <p className="text-green-400 text-center mt-3">Configurações salvas com sucesso!</p>}
    </div>
  );
};

export default AdsenseConfig;