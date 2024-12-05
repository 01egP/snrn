import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';

describe('BudgetService', () => {
  let service: BudgetService;
  let repository: Repository<Budget>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
    repository = module.get<Repository<Budget>>(getRepositoryToken(Budget));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.find on findAll', async () => {
    const budgets = [
      { id: 1, categoryId: 1, amount: 500, month: 12, year: 2000 },
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(budgets);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(budgets);
  });

  it('should call repository.create and repository.save on create', async () => {
    const createBudgetDto = {
      id: 1,
      categoryId: 1,
      amount: 500,
      month: 12,
      year: 2000,
    };
    const budget = { id: 1, ...createBudgetDto };

    jest.spyOn(repository, 'create').mockReturnValue(budget as Budget);
    jest.spyOn(repository, 'save').mockResolvedValue(budget as Budget);

    const result = await service.create(createBudgetDto);
    expect(repository.create).toHaveBeenCalledWith(createBudgetDto);
    expect(repository.save).toHaveBeenCalledWith(budget);
    expect(result).toEqual(budget);
  });

  it('should call repository.delete on remove', async () => {
    const deleteMock = jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await service.remove(1);

    expect(deleteMock).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
