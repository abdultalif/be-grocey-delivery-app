import { Products } from 'src/products/products.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Products, (product) => product.carts)
  @JoinColumn({ name: 'product_id' })
  product: Products;
}
