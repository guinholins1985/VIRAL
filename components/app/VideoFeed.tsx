import React, { useState, useEffect, useCallback } from 'react';
import { Video, User } from '../../types';
import VideoCard from './VideoCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { getRecommendation } from '../../services/geminiService';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { SparklesIcon } from '../icons/HeroIcons'; // Corrected import path

interface VideoFeedProps {
  videos: Video[];
  onOpenVideo: (video: Video) => void;
  currentUser: User;
  onUpdatePreferences: (preferences: string[]) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos, onOpenVideo, currentUser, onUpdatePreferences }) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [preferenceInput, setPreferenceInput] = useState<string>('');

  const fetchRecommendation = useCallback(async (preferences: string[]) => {
    setAiLoading(true);
    const rec = await getRecommendation(preferences);
    setRecommendation(rec);
    setAiLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser.preferences && currentUser.preferences.length > 0) {
      fetchRecommendation(currentUser.preferences);
    } else {
      setRecommendation("Parece que você é novo por aqui! Assista alguns vídeos ou nos diga seus interesses para obter recomendações personalizadas.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.preferences]); // Only re-fetch if preferences change

  const handleAddPreference = () => {
    if (preferenceInput.trim() && !currentUser.preferences.includes(preferenceInput.trim().toLowerCase())) {
      const newPreferences = [...currentUser.preferences, preferenceInput.trim().toLowerCase()];
      onUpdatePreferences(newPreferences);
      setPreferenceInput('');
      fetchRecommendation(newPreferences); // Re-fetch recommendation with new preferences
    }
  };

  const handleRemovePreference = (prefToRemove: string) => {
    const newPreferences = currentUser.preferences.filter(pref => pref !== prefToRemove);
    onUpdatePreferences(newPreferences);
    fetchRecommendation(newPreferences); // Re-fetch recommendation
  };


  return (
    <div className="container mx-auto max-w-lg pb-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Feed de Vídeos</h2>

      {/* AI Recommendation Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-purple-700">
        <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
          <SparklesIcon className="h-7 w-7 mr-2 text-purple-500" />
          Recomendação da IA
        </h3>
        {aiLoading ? (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner size="sm" color="border-purple-400" />
            <span className="ml-2 text-gray-400">Gerando sua recomendação...</span>
          </div>
        ) : (
          <p className="text-gray-300 italic mb-4">{recommendation}</p>
        )}

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
                id="preference-input"
                placeholder="Adicionar preferência (ex: comédia, jogos)"
                value={preferenceInput}
                onChange={(e) => setPreferenceInput(e.target.value)}
                className="flex-grow bg-gray-700 border-gray-600 text-gray-200"
            />
            <Button onClick={handleAddPreference} variant="secondary" className="whitespace-nowrap">
                Adicionar
            </Button>
        </div>
      </div>


      {videos.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhum vídeo disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onOpenVideo={onOpenVideo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;