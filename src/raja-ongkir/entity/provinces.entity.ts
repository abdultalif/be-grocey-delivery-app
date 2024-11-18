import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Cities } from './citites.entity';
import { Users } from 'src/users/users.entity';

@Entity()
export class Provinces {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Cities, (city) => city.province)
  cities: Cities[];

  @OneToMany(() => Users, (user) => user.province)
  users: Users[];
}
