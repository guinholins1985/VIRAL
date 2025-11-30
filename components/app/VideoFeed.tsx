import React, { useState, useEffect, useCallback } from 'react';
import { Video, User, AdsenseConfig } from '../../types';
import VideoCard from './VideoCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { getRecommendation } from '../../services/geminiService';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { SparklesIcon } from '../icons/HeroIcons';
import AdUnit from './AdUnit';

interface VideoFeedProps {
  videos: Video[]; // Now received as prop
  loading: boolean; // Now received as prop (for initial load)
  onOpenVideo: (video: Video) => void;
  currentUser: User;
  onUpdatePreferences: (preferences: string[]) => void;
  geminiApiKey: string;
  adsenseConfig: AdsenseConfig;
  loadMoreVideos: () => Promise<void>; // New prop: callback to load more videos
  hasMoreVideos: boolean; // New prop: indicates if there are more videos to load
  loadingMoreVideos: boolean; // New prop: loading state for infinite scroll
  loadInitialVideos: () => Promise<void>; // Now received as prop (renamed from refreshVideos to loadInitialVideos)
}

const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  loading,
  onOpenVideo,
  currentUser,
  onUpdatePreferences,
  geminiApiKey,
  adsenseConfig,
  loadMoreVideos,
  hasMoreVideos,
  loadingMoreVideos,
  loadInitialVideos // Renamed from refreshVideos
}) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [preferenceInput, setPreferenceInput] = useState<string>('');

  const activeAdBlocks = adsenseConfig.adBlocks.filter(block => block.active && block.placement === 'video-feed');

  const fetchRecommendation = useCallback(async (preferences: string[]) => {
    setAiLoading(true);
    const rec = await getRecommendation(preferences, geminiApiKey);
    setRecommendation(rec);
    setAiLoading(false);
  }, [geminiApiKey]);

  useEffect(() => {
    if (currentUser.preferences && currentUser.preferences.length > 0) {
      fetchRecommendation(currentUser.preferences);
    } else {
      setRecommendation("Parece que você é novo por aqui! Assista alguns vídeos ou nos diga seus interesses para obter recomendações personalizadas.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.preferences, fetchRecommendation]);

  const handleAddPreference = () => {
    if (preferenceInput.trim() && !currentUser.preferences.includes(preferenceInput.trim().toLowerCase())) {
      const newPreferences = [...currentUser.preferences, preferenceInput.trim().toLowerCase()];
      onUpdatePreferences(newPreferences);
      setPreferenceInput('');
    }
  };

  const handleRemovePreference = (prefToRemove: string) => {
    const newPreferences = currentUser.preferences.filter(pref => pref !== prefToRemove);
    onUpdatePreferences(newPreferences);
  };

  // Infinite Scroll Logic
  const handleScroll = useCallback(() => {
    // Check if user has scrolled near the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreVideos && !loadingMoreVideos) {
      loadMoreVideos();
    }
  }, [hasMoreVideos, loadingMoreVideos, loadMoreVideos]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


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


      {loading && videos.length === 0 ? ( // Display initial loading spinner only if no videos are loaded yet
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-white">Carregando vídeos...</p>
        </div>
      ) : videos.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhum vídeo disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {videos.map((video, index) => (
            <React.Fragment key={video.id}>
              <VideoCard video={video} onOpenVideo={onOpenVideo} />
              {activeAdBlocks.length > 0 && index % 3 === 0 && index !== 0 && ( // Display ad after every 3 videos
                <div className="my-6">
                  <AdUnit adBlock={activeAdBlocks[Math.floor(Math.random() * activeAdBlocks.length)]} />
                </div>
              )}
            </React.Fragment>
          ))}
          {loadingMoreVideos && ( // Display loading spinner for infinite scroll
            <div className="flex items-center justify-center p-4">
              <LoadingSpinner size="md" />
              <p className="ml-2 text-white">Carregando mais vídeos...</p>
            </div>
          )}
          {!hasMoreVideos && videos.length > 0 && ( // Message when all videos are loaded
            <p className="text-gray-400 text-center mt-4">Você viu todos os vídeos disponíveis!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;