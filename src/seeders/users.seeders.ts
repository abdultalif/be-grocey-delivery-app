import { Users } from 'src/users/users.entity';
import { DataSource } from 'typeorm';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(Users);

    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) return;

    const users = [
      {
        id: '1273ac16-c8b4-4baa-abc1-d39818a04f19',
        name: 'Abdul',
        email: 'abdultalif65@gmail.com',
        password:
          '$2b$10$LtZetK9HHfeULj3JFv9SuOjV3sy74khTEmfCbnB.8XqfBpDE6RRT.',
        role: 'Admin',
        image: 'https://ik.imagekit.io/abdullt85/users/default_3aZW1eC7-.jpg',
        image_public_id: '673b82b2e375273f608d7e3a',
        address: 'Jl. Jend. Gatot Subroto No. 1',
        province_id: null,
        city_id: null,
        phone: '0896129392392',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'de03674e-26f7-4138-8ddc-5d93313609b9',
        name: 'Talif',
        email: 'abdultalif55@gmail.com',
        password:
          '$2b$10$YKOB4MKzCflrLR0xujBHjeh8oLMdxE8PjtA4NYfTcqE.8yOEnlfdC',
        role: 'User',
        image: 'https://ik.imagekit.io/abdullt85/users/default_3aZW1eC7-.jpg',
        image_public_id: '673b82b2e375273f608d7e3a',
        address: 'Jl. Ciomas',
        province_id: null,
        city_id: null,
        phone: '0896129392392',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await userRepository.save(users);
  }
}
