import { ApiProperty } from '@nestjs/swagger';

export class BudgetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  categoryId: number;

  @ApiProperty({ example: 1000.0 })
  amount: number;

  @ApiProperty({ example: 5, description: 'Month as number (1–12)' })
  month: number;

  @ApiProperty({ example: 2025 })
  year: number;
}
