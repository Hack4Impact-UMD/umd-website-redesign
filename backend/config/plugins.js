module.exports = ({ env }) => {
  // Parse CLOUDINARY_URL from Heroku add-on (format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
  const cloudinaryUrl = env('CLOUDINARY_URL', '');
  let cloudName, apiKey, apiSecret;

  if (cloudinaryUrl) {
    const matches = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (matches) {
      [, apiKey, apiSecret, cloudName] = matches;
    }
  }

  // Fall back to individual env vars for local development
  cloudName = cloudName || env('CLOUDINARY_NAME');
  apiKey = apiKey || env('CLOUDINARY_KEY');
  apiSecret = apiSecret || env('CLOUDINARY_SECRET');

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        },
      },
    },
  };
};
