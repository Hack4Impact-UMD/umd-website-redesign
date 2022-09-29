module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  proxy: true,
  url: env('MY_HEROKU_URL'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
