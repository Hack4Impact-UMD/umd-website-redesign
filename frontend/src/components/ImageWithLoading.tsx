import React, { useState, ImgHTMLAttributes } from 'react';

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
        transition: 'opacity 0.3s',
        ...style
      }}
      {...props}
    />
  );
};

export default ImageWithLoading;
