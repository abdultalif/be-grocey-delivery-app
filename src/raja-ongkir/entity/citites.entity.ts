import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Provinces } from './provinces.entity';
import { Users } from 'src/users/users.entity';

@Entity()
export class Cities {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  province_id: number;

  @Column()
  type: string;

  @Column()
  postal_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Provinces, (province) => province.id)
  @JoinColumn({ name: 'province_id' })
  province: Provinces;

  @OneToMany(() => Users, (user) => user.city)
  users: Users[];
}
