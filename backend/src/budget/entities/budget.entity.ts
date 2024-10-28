import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  month: number;

  @Column()
  year: number;
}
