import { PostgreSQLConfig } from './postgres';

export default () => ({
  PostgreSQL: PostgreSQLConfig,
  ClientJwtSecret: process.env.CLIENT_JWT_SECRET,
  AdminSwaggerEntrance: 'swagger/admin',
  ClientSwaggerEntrance: 'swagger/client',
});
