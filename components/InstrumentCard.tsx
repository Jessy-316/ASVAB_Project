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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={instrument.image || '/images/default-instrument.jpg'} 
          alt={instrument.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{instrument.name}</h2>
        <p className="text-gray-600 mb-4">{instrument.description}</p>
        
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
