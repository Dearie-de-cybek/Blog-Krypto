module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'gvivhsdsjvnhdbvfsjhdfbgskdghbfjdbvshdfbvdjvhndfkjsvhbhdfvbdfjvdsjbvhfdbvhd',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development'
};