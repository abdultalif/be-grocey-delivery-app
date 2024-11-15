import { Carts } from 'src/carts/carts.entity';
import { Reviews } from 'src/reviews/reviews.entity';
import { Transaction_Details } from 'src/transaction/entity/transaction_details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column()
  weight: number;

  @Column()
  image: string;

  @Column()
  image_public_id: string;

  @Column({ default: null })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Carts, (cart) => cart.product)
  carts: Carts[];

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[];

  @OneToMany(
    () => Transaction_Details,
    (transaction_detail) => transaction_detail.product,
  )
  transaction_details: Transaction_Details[];
}
