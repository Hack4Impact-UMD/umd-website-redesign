module.exports = ({ env }) => {
  const cloudinaryUrl = env('CLOUDINARY_URL', '');
  const parsed = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/);

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: parsed?.[3] || env('CLOUDINARY_NAME'),
          api_key: parsed?.[1] || env('CLOUDINARY_KEY'),
          api_secret: parsed?.[2] || env('CLOUDINARY_SECRET'),
        },
      },
    },
  };
};
