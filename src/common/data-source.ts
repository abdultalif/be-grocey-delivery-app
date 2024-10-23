import { CreateUsersTable1729600477535 } from 'src/migrations/1729600477535-CreateUsersTable';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/users.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_HOST),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users],
  migrations: [CreateUsersTable1729600477535],
  synchronize: false,
});
