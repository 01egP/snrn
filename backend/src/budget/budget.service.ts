import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const newBudget = this.budgetRepository.create(createBudgetDto);
    return await this.budgetRepository.save(newBudget);
  }

  async findAll(): Promise<Budget[]> {
    return this.budgetRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number) {
    return `This action updates a #${id} budget`;
  }

  async remove(id: number): Promise<{ affected: number }> {
    const result = await this.budgetRepository.delete(id);
    return { affected: result.affected ?? 0 };
  }
}
