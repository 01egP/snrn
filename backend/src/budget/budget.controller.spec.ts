import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';

describe('BudgetController', () => {
  let controller: BudgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
