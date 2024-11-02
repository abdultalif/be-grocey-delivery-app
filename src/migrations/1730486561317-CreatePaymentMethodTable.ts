// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class CreatePaymentMethodTable1730486561317
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'payment_method',
//         columns: [
//           {
//             name: 'id',
//             type: 'uuid',
//             isPrimary: true,
//             default: 'uuid_generate_v4()',
//           },
//           {
//             name: 'name',
//             type: 'varchar',
//           },
//           {
//             name: 'group',
//             type: 'varchar',
//           },
//           {
//             name: 'code',
//             type: 'varchar',
//           },
//           {
//             name: 'fee',
//             type: 'varchar',
//           },
//           {
//             name: 'icon_url',
//             type: 'varchar',
//             isNullable: true,
//           },
//           {
//             name: 'created_at',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'updated_at',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//             onUpdate: 'CURRENT_TIMESTAMP',
//           },
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('payment_method');
//   }
// }
