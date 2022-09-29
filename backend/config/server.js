module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8082),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
