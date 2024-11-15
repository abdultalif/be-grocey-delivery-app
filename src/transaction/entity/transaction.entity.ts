import { Users } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction_Details } from './transaction_details.entity';
import { Reviews } from 'src/reviews/reviews.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  total_price: number;

  @Column()
  shipping_price: number;

  @Column()
  status_transaction: string;

  @Column()
  token_midtrans: string;

  @Column()
  response_midtrans: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(
    () => Transaction_Details,
    (transaction_detail) => transaction_detail.transaction,
    { cascade: true },
  )
  transaction_details: Transaction_Details[];

  @OneToMany(() => Reviews, (review) => review.transaction, { cascade: true })
  reviews: Reviews[];
}
