/**
 * NOT NEEDED ANYMORE. GO TO 'joi.validation.ts'
 * @returns
 */
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDb: process.env.MONGODB,
  dbName: process.env.DB_NAME,
  port: process.env.PORT || 3001,
});
