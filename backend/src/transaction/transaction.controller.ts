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
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  async createTransaction(
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(dto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    type: [TransactionResponseDto],
  })
  async findAll(): Promise<TransactionResponseDto[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Transaction by userId',
    type: [TransactionResponseDto],
  })
  async findOne(@Param('id') id: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionService.findByUserId(+id);
    return plainToInstance(TransactionResponseDto, transactions);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const updated = await this.transactionService.update(+id, dto);
    return plainToInstance(TransactionResponseDto, updated);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Transaction deleted' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
