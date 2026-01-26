import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps {
  text: string;
  link: string;
  color: 'blue' | 'green';
  ariaLabel?: string;
  externalLink?: boolean;
}

const StandardButton = ({ text, link, color, ariaLabel, externalLink }: ButtonProps) => {
  const colorClass = color === 'green'
    ? 'bg-h4i-mint hover:bg-h4i-mint/90 text-white'
    : 'bg-h4i-blue hover:bg-h4i-blue/90 text-white';

  const buttonComponent = (
    <Button
      className={cn('rounded-full px-8 py-6 text-base font-medium transition-all', colorClass)}
      type="button"
      aria-label={ariaLabel}
    >
      {text}
    </Button>
  );

  if (externalLink) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {buttonComponent}
      </a>
    );
  }

  return <Link to={link}>{buttonComponent}</Link>;
};

export default StandardButton;
