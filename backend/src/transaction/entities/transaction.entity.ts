import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column()
  categoryId: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  latitude: number | null;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  longitude: number | null;
}
