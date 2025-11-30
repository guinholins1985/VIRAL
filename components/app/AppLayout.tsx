import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import VideoFeed from './VideoFeed';
import UserProfile from './UserProfile';
import RewardTracker from './RewardTracker';
import { User, Video, RewardConfig, AdsenseConfig } from '../../types'; // Import AdsenseConfig
import { getVideos, addVideoReward, getCurrentUser, updateUserPreferences } from '../../services/apiService';
import VideoPlayerPage from './VideoPlayerPage';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AppLayoutProps {
  currentUser: User;
  onLogout: () => void;
  geminiApiKey: string; // Add geminiApiKey prop
  rewardConfig: RewardConfig; // Add rewardConfig prop
  adsenseConfig: AdsenseConfig; // Add adsenseConfig prop
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentUser: initialUser, onLogout, geminiApiKey, rewardConfig, adsenseConfig }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [currentPage, setCurrentPage] = useState<'feed' | 'profile' | 'rewards'>('feed');
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const fetchedVideos = await getVideos();
    setVideos(fetchedVideos);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoWatchComplete = useCallback(async (videoId: string) => {
    const updatedUser = await addVideoReward(currentUser.id, videoId);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      setRewardMessage(`Você ganhou R$${(updatedUser.balance - currentUser.balance).toFixed(2)}!`);
      setTimeout(() => setRewardMessage(null), 3000);
    }
  }, [currentUser]);

  const handleUpdatePreferences = useCallback(async (preferences: string[]) => {
    const updatedUser = await updateUserPreferences(currentUser.id, preferences);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      alert('Preferências atualizadas com sucesso!');
    }
  }, [currentUser]);

  const handleNavigateToFeed = () => {
    setCurrentPlayingVideo(null); // Stop playing video when navigating away
    setCurrentPage('feed');
  };

  const handleOpenVideo = (video: Video) => {
    setCurrentPlayingVideo(video);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando vídeos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-grow mt-[64px] pb-16 md:pb-0"> {/* Adjust padding for fixed header and potential mobile nav */}
        {rewardMessage && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            {rewardMessage}
          </div>
        )}

        {currentPlayingVideo ? (
          <VideoPlayerPage
            video={currentPlayingVideo}
            onVideoEnded={() => handleVideoWatchComplete(currentPlayingVideo.id)}
            onClose={handleNavigateToFeed}
            currentUser={currentUser}
            minWatchTimeSeconds={rewardConfig.minWatchTimeSeconds} // Pass updated min watch time
          />
        ) : (
          <div className="p-4 pt-8 md:p-8">
            {currentPage === 'feed' && (
              <VideoFeed
                videos={videos}
                onOpenVideo={handleOpenVideo}
                currentUser={currentUser}
                onUpdatePreferences={handleUpdatePreferences}
                geminiApiKey={geminiApiKey} // Pass updated Gemini API key
                adsenseConfig={adsenseConfig} // Pass adsense config to VideoFeed
              />
            )}
            {currentPage === 'profile' && (
              <UserProfile currentUser={currentUser} onUserUpdate={setCurrentUser} onUpdatePreferences={handleUpdatePreferences} />
            )}
            {currentPage === 'rewards' && (
              <RewardTracker currentUser={currentUser} rewardConfig={rewardConfig} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;