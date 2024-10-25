import { CreateUsersTable1729600477535 } from 'src/migrations/1729600477535-CreateUsersTable';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/users.entity';
import { CreateProdcutsTable1729681632710 } from 'src/migrations/1729681632710-CreateProdcutsTable';
import { Products } from 'src/products/products.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_HOST),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Products],
  migrations: [CreateUsersTable1729600477535, CreateProdcutsTable1729681632710],
  synchronize: false,
});
