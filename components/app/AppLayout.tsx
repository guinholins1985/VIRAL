import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import VideoFeed from './VideoFeed';
import UserProfile from './UserProfile';
import RewardTracker from './RewardTracker';
import { User, Video, RewardConfig, AdsenseConfig } from '../../types';
import { addVideoReward, updateUserPreferences } from '../../services/apiService';
import VideoPlayerPage from './VideoPlayerPage';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AppLayoutProps {
  currentUser: User;
  onLogout: () => void;
  geminiApiKey: string;
  rewardConfig: RewardConfig;
  adsenseConfig: AdsenseConfig;
  videos: Video[]; // Now received as prop
  loadingVideos: boolean; // Now received as prop
  loadMoreVideos: () => Promise<void>; // New prop: callback to load more videos
  hasMoreVideos: boolean; // New prop: indicates if there are more videos to load
  loadingMoreVideos: boolean; // New prop: loading state for infinite scroll
  loadInitialVideos: () => Promise<void>; // Now received as prop (renamed from refreshVideos to loadInitialVideos)
  onUpdateCurrentUser: () => Promise<void>; // New prop: callback to refresh global currentUser state
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentUser, onLogout, geminiApiKey, rewardConfig, adsenseConfig, videos, loadingVideos, loadMoreVideos, hasMoreVideos, loadingMoreVideos: propLoadingMoreVideos, loadInitialVideos, onUpdateCurrentUser }) => {
  // currentUser is now received as a prop from App.tsx, no longer managed locally here.
  // const [currentUser, setCurrentUser] = useState<User>(initialUser); 
  const [currentPage, setCurrentPage] = useState<'feed' | 'profile' | 'rewards'>('feed');
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const handleVideoWatchComplete = useCallback(async (videoId: string) => {
    const updatedUser = await addVideoReward(currentUser.id, videoId);
    if (updatedUser) {
      // Notify App.tsx to update its global currentUser state
      await onUpdateCurrentUser(); 
      // Calculate gained amount to display
      const previousBalance = currentUser.balance;
      const newBalance = updatedUser.balance;
      const gained = newBalance - previousBalance;

      setRewardMessage(`Você ganhou R$${gained.toFixed(2)}!`);
      // Also refresh the global video list to update view counts (optional, but good for consistency)
      await loadInitialVideos(); 
      setTimeout(() => setRewardMessage(null), 3000);
    }
  }, [currentUser, onUpdateCurrentUser, loadInitialVideos]);

  const handleUpdatePreferences = useCallback(async (preferences: string[]) => {
    const updatedUser = await updateUserPreferences(currentUser.id, preferences);
    if (updatedUser) {
      // Notify App.tsx to update its global currentUser state
      await onUpdateCurrentUser(); 
      alert('Preferências atualizadas com sucesso!');
    }
  }, [currentUser, onUpdateCurrentUser]);

  const handleNavigateToFeed = () => {
    setCurrentPlayingVideo(null); // Stop playing video when navigating away
    setCurrentPage('feed');
  };

  const handleOpenVideo = (video: Video) => {
    setCurrentPlayingVideo(video);
  };

  if (loadingVideos) { // Use prop loadingVideos
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
      <main className="flex-grow mt-[64px] pb-16 md:pb-0">
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
            minWatchTimeSeconds={rewardConfig.minWatchTimeSeconds}
          />
        ) : (
          <div className="p-4 pt-8 md:p-8">
            {currentPage === 'feed' && (
              <VideoFeed
                videos={videos} // Pass videos from prop
                loading={loadingVideos} // Pass loading state from prop
                onOpenVideo={handleOpenVideo}
                currentUser={currentUser}
                onUpdatePreferences={handleUpdatePreferences}
                geminiApiKey={geminiApiKey}
                adsenseConfig={adsenseConfig}
                loadMoreVideos={loadMoreVideos} // Pass load more callback
                hasMoreVideos={hasMoreVideos} // Pass has more videos state
                loadingMoreVideos={propLoadingMoreVideos} // Pass loading more state correctly
                loadInitialVideos={loadInitialVideos} // Pass the refresh callback
              />
            )}
            {currentPage === 'profile' && (
              <UserProfile currentUser={currentUser} onUpdateCurrentUser={onUpdateCurrentUser} onUpdatePreferences={handleUpdatePreferences} />
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