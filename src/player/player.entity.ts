import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 16 })
  tag: string;

  @Column({ type: 'integer', unsigned: true })
  trophies: number;

  @Column({ type: 'smallint' })
  difference: number;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;
}
