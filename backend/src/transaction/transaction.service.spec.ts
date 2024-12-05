import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.create and repository.save on create', async () => {
    const createTransactionDto = {
      amount: 100,
      type: TransactionType.INCOME,
      categoryId: 1,
      date: new Date(),
      description: 'Test transaction',
    };
    const transaction = { id: 1, ...createTransactionDto };

    jest
      .spyOn(repository, 'create')
      .mockReturnValue(transaction as Transaction);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(transaction as Transaction);

    const result = await service.create(createTransactionDto);
    expect(repository.create).toHaveBeenCalledWith(createTransactionDto);
    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(result).toEqual(transaction);
  });
});
