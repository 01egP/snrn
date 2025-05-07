import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 1000.0 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 5, description: 'Month as number (1–12)' })
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  @IsNumber()
  year: number;
}
