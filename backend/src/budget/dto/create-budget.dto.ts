import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  month: number;

  @IsNotEmpty()
  year: number;
}
