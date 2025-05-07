import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Budget created',
    type: BudgetResponseDto,
  })
  async create(@Body() dto: CreateBudgetDto): Promise<BudgetResponseDto> {
    const created = await this.budgetService.create(dto);
    return plainToInstance(BudgetResponseDto, created);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All budgets',
    type: [BudgetResponseDto],
  })
  async findAll(): Promise<BudgetResponseDto[]> {
    const budgets = await this.budgetService.findAll();
    return plainToInstance(BudgetResponseDto, budgets);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Budget by ID',
    type: BudgetResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<BudgetResponseDto> {
    const budget = await this.budgetService.findOne(+id);
    return plainToInstance(BudgetResponseDto, budget);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Budget updated',
    type: BudgetResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    const updated = await this.budgetService.update(+id, dto);
    return plainToInstance(BudgetResponseDto, updated);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Budget deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.budgetService.remove(+id);
  }
}
