'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instrument } from '@/types/instrument';

interface InstrumentCardProps {
  instrument: Instrument;
}

export default function InstrumentCard({ instrument }: InstrumentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [imageError, setImageError] = useState(false);

  const playSound = () => {
    if (!instrument.sound) return;
    
    if (!audio) {
      const newAudio = new Audio(instrument.sound);
      setAudio(newAudio);
      
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
        {!imageError ? (
          <Image
            src={instrument.image || '/images/default-instrument.jpg'} 
            alt={instrument.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{instrument.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{instrument.description}</p>
        
        {instrument.sound && (
          <button
            onClick={playSound}
            className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
              isPlaying 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? 'Stop Sound' : 'Play Sound'}
          </button>
        )}
      </div>
    </div>
  );
} 
