import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @ApiProperty({ example: 150.75 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-05-07T12:47:01.683Z' })
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ enum: TransactionType, example: 'income' })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Freelance project payment' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 50.4501 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 30.5234 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 7 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
