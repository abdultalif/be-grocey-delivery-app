import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Provinces } from './provinces.entity';

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
}
