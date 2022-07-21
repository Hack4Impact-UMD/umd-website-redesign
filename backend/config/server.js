module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['otf/LzCphqGi+P97We8U6FDaPtWqYFuR7aAJeF7j1iM='], ),
  },
});
