module.exports = ({ env }) => ({
  auth: {
    secret: env('JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_SALT'),
  },
});
