import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from './create-transaction.dto';

export class TransactionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 120.5 })
  amount: number;

  @ApiProperty({ example: '2025-05-07T12:47:01.683Z' })
  date: Date;

  @ApiProperty({ example: 2 })
  categoryId: number;

  @ApiProperty({ enum: TransactionType, example: 'income' })
  type: string;

  @ApiProperty({ example: 'Salary for May' })
  description: string;

  @ApiPropertyOptional({ example: 50.4501 })
  latitude?: number;

  @ApiPropertyOptional({ example: 30.5234 })
  longitude?: number;

  @ApiProperty({ example: 5 })
  userId: number;
}
