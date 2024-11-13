import { Products } from 'src/products/products.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transaction_details')
export class Transaction_Details {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  sub_total: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Products, (product) => product.transaction_details)
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.transaction_details,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
