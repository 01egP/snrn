import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    categoryId: number;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNotEmpty()
    description: string;
}
