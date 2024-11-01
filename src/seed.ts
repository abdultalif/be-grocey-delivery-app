import { UserSeeder } from './seeders/users.seeders';
import { AppDataSource } from './database/data-source';
import { productSeeder } from './seeders/products.seeders';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  await new productSeeder().run(dataSource);
  await new UserSeeder().run(dataSource);

  console.log('Seeding completed');
  await dataSource.destroy();
}

seed().catch((error) => console.error(error));
