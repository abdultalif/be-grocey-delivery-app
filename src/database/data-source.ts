import { CreateUsersTable1729600477535 } from 'src/migrations/1729600477535-CreateUsersTable';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/users.entity';
import { CreateProdcutsTable1729681632710 } from 'src/migrations/1729681632710-CreateProdcutsTable';
import { Products } from 'src/products/products.entity';
import { CreateCartsTable1730118303674 } from 'src/migrations/1730118303674-CreateCartsTable';
import { Carts } from 'src/carts/carts.entity';
import { CreateProvincesTable1730506349564 } from 'src/migrations/1730506349564-CreateProvincesTable';
import { Provinces } from 'src/raja-ongkir/entity/provinces.entity';
import { CreateCitiesTable1730506365285 } from 'src/migrations/1730506365285-CreateCitiesTable';
import { Cities } from 'src/raja-ongkir/entity/citites.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_HOST),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Products, Carts, Provinces, Cities],
  migrations: [
    CreateUsersTable1729600477535,
    CreateProdcutsTable1729681632710,
    CreateCartsTable1730118303674,
    CreateProvincesTable1730506349564,
    CreateCitiesTable1730506365285,
  ],
  synchronize: false,
});
