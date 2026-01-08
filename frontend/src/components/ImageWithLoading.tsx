import React, { useState, ImgHTMLAttributes } from 'react';
import { FADE_IN_TRANSITION } from '../constants/animations';

interface ImageWithLoadingProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({
  src,
  alt,
  fallbackSrc,
  style,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      onLoad={() => setImageLoaded(true)}
      onError={() => {
        setImageError(true);
        setImageLoaded(true);
      }}
      style={{
        opacity: imageLoaded ? 1 : 0,
        transition: FADE_IN_TRANSITION,
        ...style
      }}
      {...props}
    />
  );
};

export default ImageWithLoading;
