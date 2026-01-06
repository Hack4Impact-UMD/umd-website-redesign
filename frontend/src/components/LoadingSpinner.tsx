import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-12 h-12 text-h4i-blue animate-spin" />
      <p className="text-h4i-gray text-lg">Loading projects...</p>
    </div>
  );
};

export default LoadingSpinner;
