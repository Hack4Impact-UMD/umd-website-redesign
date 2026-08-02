import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SCROLL_THRESHOLD = 300;

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(document.documentElement.scrollTop > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-h4i-blue hover:bg-h4i-blue/90 text-white shadow-lg transition-all hover:scale-110"
      size="icon"
      aria-label="Scroll to Top"
    >
      <ArrowUp className="w-6 h-6" />
    </Button>
  );
};

export default ScrollToTopButton;
