import { UserSeeder } from './seeders/users.seeders';
import { AppDataSource } from './database/data-source';
import { productSeeder } from './seeders/products.seeders';
import { ProvincesSeeder } from './seeders/provinces.seeders';
import { CitiesSeeder } from './seeders/cities.seeders';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  await new productSeeder().run(dataSource);
  await new UserSeeder().run(dataSource);
  await new ProvincesSeeder().run(dataSource);
  await new CitiesSeeder().run(dataSource);

  console.log('Seeding completed');
  await dataSource.destroy();
}

seed().catch((error) => console.error(error));
