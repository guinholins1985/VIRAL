import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, User } from '../../types';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import { XCircleIcon, CheckCircleIcon } from '../icons/HeroIcons';

interface VideoPlayerPageProps {
  video: Video;
  onVideoEnded: () => void;
  onClose: () => void;
  currentUser: User;
  minWatchTimeSeconds: number; // Accept minWatchTimeSeconds as prop
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ video, onVideoEnded, onClose, currentUser, minWatchTimeSeconds }) => {
  const [watchedTime, setWatchedTime] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const getEmbedUrl = (url: string, source: Video['source']) => {
    if (source === 'youtube') {
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const playlistMatch = url.match(/[?&]list=([^&]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&controls=1&modestbranding=1&rel=0`;
      } else if (playlistMatch && playlistMatch[1]) {
        // For playlists, just embed the playlist directly. Autoplay might not work reliably for initial video in playlist.
        return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}&autoplay=1&controls=1&modestbranding=1&rel=0`;
      }
    } else if (source === 'vimeo') {
      const vimeoIdMatch = url.match(/(?:vimeo\.com\/)(?:channels\/[^\/]+\/)?(\d+)/);
      if (vimeoIdMatch && vimeoIdMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoIdMatch[1]}?autoplay=1&controls=1&byline=0&portrait=0`;
      }
    }
    return ''; // Fallback for unsupported URLs or errors
  };

  const embedUrl = getEmbedUrl(video.url, video.source);

  useEffect(() => {
    setWatchedTime(0);
    setRewardClaimed(false);
    setIsLoadingEmbed(true); // Reset loading state for new video

    intervalRef.current = window.setInterval(() => {
      setWatchedTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [video.id]);

  useEffect(() => {
    if (watchedTime >= minWatchTimeSeconds && !rewardClaimed) { // Use prop minWatchTimeSeconds
      onVideoEnded();
      setRewardClaimed(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTime, rewardClaimed, onVideoEnded, minWatchTimeSeconds]); // `minWatchTimeSeconds` added to dependencies
  // `onVideoEnded` should now be in deps as it causes re-renders based on parent user object changes.
  // It's memoized in AppLayout, so adding it here is safe and correct.

  const handleIframeLoad = useCallback(() => {
    setIsLoadingEmbed(false);
  }, []);

  const progressPercentage = Math.min((watchedTime / minWatchTimeSeconds) * 100, 100);

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 p-2 sm:p-4 md:p-8">
      <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center">
        {isLoadingEmbed && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
            <LoadingSpinner size="lg" />
            <p className="ml-4 text-white text-lg">Carregando vídeo...</p>
          </div>
        )}
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-[60vh] md:h-[80vh] bg-black rounded-lg shadow-2xl"
            onLoad={handleIframeLoad}
          ></iframe>
        ) : (
          <div className="w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-red-800 rounded-lg text-white">
            <p>Não foi possível carregar o vídeo. URL inválida ou tipo de fonte não suportado.</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-1">{video.title}</h2>
            <p className="text-sm text-gray-300">Seu Saldo: <span className="font-semibold text-green-400">R${currentUser.balance.toFixed(2)}</span></p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-300">
              {rewardClaimed ? (
                <span className="flex items-center text-green-400 font-semibold">
                  <CheckCircleIcon className="h-5 w-5 mr-1" /> Recompensa Resgatada!
                </span>
              ) : (
                `Assistindo: ${watchedTime}s / ${minWatchTimeSeconds}s para recompensa`
              )}
            </p>
          </div>
          <Button onClick={onClose} variant="secondary" className="mt-3 md:mt-0 px-6">
            <XCircleIcon className="h-5 w-5 mr-2" /> Fechar Vídeo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;