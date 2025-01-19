import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // Disable sync for production
  ssl:
    process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
      ? { rejectUnauthorized: false }
      : false,
  logging: true,
  entities: ['dist/src/app/domain/**/*.entity.js'],
  migrations: ['dist/src/storage/database/migrations/**/*.js'],
  subscribers: ['dist/src/storage/database/subscriber/**/*.js'],
  migrationsTransactionMode: 'each',
});

export default AppDataSource;
