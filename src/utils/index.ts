export const getEnvFile = () => (process.env.NODE_ENV == 'production' ? 'env/.env.production' : 'env/.env.development');
