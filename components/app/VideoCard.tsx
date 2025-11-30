import React from 'react';
import { Video } from '../../types';
import { PlayIcon, DollarSignIcon } from '../icons/HeroIcons';

interface VideoCardProps {
  video: Video;
  onOpenVideo: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onOpenVideo }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-6">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-semibold text-white truncate">{video.title}</h3>
        <p className="text-gray-300 text-sm flex items-center mt-1">
          <span className="mr-2">{formatDuration(video.duration)}</span>
          <span className="flex items-center">
            <DollarSignIcon className="h-4 w-4 text-green-400 mr-1" />
            Ganhe pontos
          </span>
        </p>
      </div>
      <button
        onClick={() => onOpenVideo(video)}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-opacity duration-200"
        aria-label={`Reproduzir ${video.title}`}
      >
        <PlayIcon className="h-16 w-16 text-white opacity-80" />
      </button>
    </div>
  );
};

export default VideoCard;