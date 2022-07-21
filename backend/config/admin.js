module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'JY/94R4V3cPcKMdIZfMQtzf3KaNXwG7lUxd9y/4id1Y='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'JGT4V99lBVL/WwzaKGkNF8ii5ZjMqoiIs4WxFTN/BT0='),
  },
});
