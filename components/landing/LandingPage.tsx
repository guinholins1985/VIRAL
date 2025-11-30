import React, { useRef, useState } from 'react';
import { DollarSignIcon, VideoIcon, GiftIcon } from '../icons/HeroIcons'; // Assume these icons are created

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const rotateY = ((clientX - centerX) / (width / 2)) * 10; // Max 10 degrees rotation
    const rotateX = ((clientY - centerY) / (height / 2)) * -10; // Max 10 degrees rotation

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden py-10 md:py-20 px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-bounce blob-animation-1"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-bounce blob-animation-2"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 block">
            Sua Jornada Viral
          </span>
          <span className="block mt-2">Começa Aqui</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Transforme seu tempo de tela em recompensas reais. Assista a vídeos, ganhe pontos e saque seu saldo, tudo de forma divertida e fácil.
        </p>

        {/* Interactive 3D Card */}
        <div
          ref={cardRef}
          className="relative w-72 h-96 md:w-80 md:h-[400px] bg-gray-800 rounded-3xl shadow-2xl mx-auto flex items-center justify-center p-6 mb-12 transform-gpu transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Card Content */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <VideoIcon className="w-16 h-16 text-purple-400 opacity-80" />
            <h3 className="text-3xl font-bold text-gray-100">CASHVIRAL</h3>
            <p className="text-gray-400 text-sm max-w-[200px]">Assista, Ganhe, Resgate. Simples assim!</p>
          </div>

          {/* Floating Icons */}
          <div
            className="absolute top-8 left-8 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg transform-gpu"
            style={{ transform: `translateZ(50px) rotateX(${rotation.x * 2}deg) rotateY(${rotation.y * 2}deg)` }}
          >
            <DollarSignIcon className="w-6 h-6 text-white" />
          </div>
          <div
            className="absolute bottom-12 right-10 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg transform-gpu"
            style={{ transform: `translateZ(70px) rotateX(${rotation.x * 1.5}deg) rotateY(${rotation.y * 1.5}deg)` }}
          >
            <GiftIcon className="w-6 h-6 text-white" />
          </div>
          <div
            className="absolute top-20 right-6 p-3 bg-gradient-to-br from-green-500 to-lime-500 rounded-full shadow-lg transform-gpu"
            style={{ transform: `translateZ(30px) rotateX(${rotation.x * 0.8}deg) rotateY(${rotation.y * 0.8}deg)` }}
          >
            <VideoIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Começar a Ganhar Agora
          <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;