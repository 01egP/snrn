import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.find on findAll', async () => {
    const categories = [{ id: 1, name: 'Test Category' }];
    jest.spyOn(repository, 'find').mockResolvedValue(categories);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });
});
