import 'dotenv/config';

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const env = process.env;

export default {
  port: env.PORT || 5000,
  mongoUri: env.MONGO_URI,
  // Passed to mongoose explicitly: a URI without a database path would
  // otherwise default to the "test" database.
  dbName: env.MONGO_DB_NAME || 'mech-shop',
  jwtSecret: env.JWT_SECRET,
  jwtExpires: env.JWT_EXPIRES || '8h',
  clientOrigin: env.CLIENT_ORIGIN || 'http://localhost:5173',
  isProd: env.NODE_ENV === 'production',
  admin: {
    name: env.ADMIN_NAME || 'Shop Admin',
    loginId: env.ADMIN_LOGIN_ID,
    password: env.ADMIN_PASSWORD,
  },
};
