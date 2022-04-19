import React from 'react';

interface ButtonProps {
  border: string;
  color: string;
  children?: React.ReactNode;
  onClick: () => void;
  height: string;
  width: string;
  radius: string;
  text: string;
}

const Button: React.FC<ButtonProps> = ({
  border,
  color,
  children,
  onClick,
  height,
  width,
  text,
  radius,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        border,
        borderRadius: radius,
        height,
        width,
      }}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
