module.exports = ({ env }) => {
  // Parse CLOUDINARY_URL if set (Heroku add-on format: cloudinary://key:secret@cloud_name)
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
