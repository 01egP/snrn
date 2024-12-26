import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionService.create(createTransactionDto);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findByUserId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.transactionService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
