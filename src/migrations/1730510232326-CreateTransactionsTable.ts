// import {
//   MigrationInterface,
//   QueryRunner,
//   TableForeignKey,
//   Table,
// } from 'typeorm';

// export class CreateTransactionsTable1730510232326
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'transaction',
//         columns: [
//           {
//             name: 'id',
//             type: 'uuid',
//             isPrimary: true,
//             default: 'uuid_generate_v4()',
//           },
//           {
//             name: 'user_id',
//             type: 'uuid',
//           },
//           {
//             name: 'payment_method_id',
//             type: 'uuid',
//           },
//           {
//             name: 'date',
//             type: 'date',
//           },
//           {
//             name: 'invoice_number',
//             type: 'varchar',
//           },
//           {
//             name: 'shipping_code',
//             type: 'varchar',
//           },
//           {
//             name: 'shipping_receipt',
//             type: 'varchar',
//           },
//           {
//             name: 'shipping_service',
//             type: 'varchar',
//           },
//           {
//             name: 'product_price',
//             type: 'varchar',
//           },
//           {
//             name: 'shipping_price',
//             type: 'varchar',
//           },
//           {
//             name: 'total_price',
//             type: 'varchar',
//           },
//           {
//             name: 'payment_price',
//             type: 'varchar',
//           },
//           {
//             name: 'payment_reference',
//             type: 'varchar',
//           },
//           {
//             name: 'payment_status',
//             type: 'varchar',
//           },
//           {
//             name: 'payment_expire_time',
//             type: 'time',
//           },
//           {
//             name: 'payment_instruction',
//             type: 'varchar',
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

//     await queryRunner.createForeignKeys('transaction', [
//       new TableForeignKey({
//         columnNames: ['user_id'],
//         referencedColumnNames: ['id'],
//         referencedTableName: 'users',
//         onDelete: 'CASCADE',
//       }),
//       new TableForeignKey({
//         columnNames: ['payment_method_id'],
//         referencedColumnNames: ['id'],
//         referencedTableName: 'payment_method',
//         onDelete: 'CASCADE',
//       }),
//     ]);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('transaction');
//   }
// }
