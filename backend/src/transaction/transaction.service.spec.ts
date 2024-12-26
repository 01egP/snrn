import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  TransactionType,
  CreateTransactionDto,
} from './dto/create-transaction.dto';

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
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      type: TransactionType.INCOME,
      categoryId: 1,
      date: new Date(),
      description: 'Test transaction',
      userId: 1,
      latitude: 40.7128,
      longitude: -74.006,
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

  it('should throw an error if userId is missing', async () => {
    const createTransactionDto: Partial<CreateTransactionDto> = {
      amount: 100,
      type: TransactionType.INCOME,
      categoryId: 1,
      date: new Date(),
      description: 'Test transaction',
    };

    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new Error('userId is required');
    });

    await expect(
      service.create(createTransactionDto as CreateTransactionDto),
    ).rejects.toThrow('userId is required');
  });

  it('should retrieve all transactions', async () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        amount: 100,
        type: TransactionType.INCOME,
        categoryId: 1,
        date: new Date(),
        description: 'Transaction 1',
        userId: 1,
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        id: 2,
        amount: 50,
        type: TransactionType.EXPENSE,
        categoryId: 2,
        date: new Date(),
        description: 'Transaction 2',
        userId: 1,
        latitude: 40.7128,
        longitude: -74.006,
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(transactions);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(transactions);
  });
});
