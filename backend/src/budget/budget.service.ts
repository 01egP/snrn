import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly repo: Repository<Budget>,
  ) {}

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const budget = this.repo.create(dto);
    return this.repo.save(budget);
  }

  async findAll(): Promise<Budget[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.repo.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return budget;
  }

  async update(id: number, dto: UpdateBudgetDto): Promise<Budget> {
    const existing = await this.findOne(id);
    const updated = this.repo.merge(existing, dto);
    return this.repo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
  }
}
