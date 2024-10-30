import { UserSeeder } from './seeders/users.seeders';
import { AppDataSource } from './database/data-source';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  await new UserSeeder().run(dataSource);

  console.log('Seeding completed');
  await dataSource.destroy();
}

seed().catch((error) => console.error(error));
