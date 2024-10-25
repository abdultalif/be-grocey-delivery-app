import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProdcutsTable1729681632710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'varchar',
          },
          {
            name: 'stock',
            type: 'varchar',
          },
          {
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'image_public_id',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            default: null,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
