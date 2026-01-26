import React from 'react';
import { Loader2 } from 'lucide-react';

const MIN_HEIGHT = 400;

interface LoadingSpinnerProps {
  message?: string;
  text?: string;
}

const LoadingSpinner = ({ message, text }: LoadingSpinnerProps) => {
  const displayText = message || text || 'Loading...';
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{ minHeight: `${MIN_HEIGHT}px` }}
    >
      <Loader2 className="w-12 h-12 text-h4i-blue animate-spin" />
      <p className="text-h4i-gray text-lg">{displayText}</p>
    </div>
  );
};

export default LoadingSpinner;
