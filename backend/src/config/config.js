module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'sdcsdcdc32ry38y9dpnp23i3892te832tp9e230n',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development'
};