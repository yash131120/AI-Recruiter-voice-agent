import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 h-8 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-current rounded-full transition-all duration-300 ${
            isActive 
              ? 'animate-pulse' 
              : 'h-2'
          }`}
          style={{
            height: isActive ? `${Math.random() * 20 + 10}px` : '8px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;