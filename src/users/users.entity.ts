import { Carts } from 'src/carts/carts.entity';
import { Cities } from 'src/raja-ongkir/entity/citites.entity';
import { Provinces } from 'src/raja-ongkir/entity/provinces.entity';
import { Reviews } from 'src/reviews/reviews.entity';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  image: string;

  @Column()
  image_public_id: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: 'User' })
  role: string;

  @Column({ default: true })
  is_verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Carts, (cart) => cart.user)
  carts: Carts[];

  @OneToMany(() => Reviews, (review) => review.user)
  reviews: Reviews[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @ManyToOne(() => Cities, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: Cities;

  @ManyToOne(() => Provinces, (province) => province.id)
  @JoinColumn({ name: 'province_id' })
  province: Provinces;
}
