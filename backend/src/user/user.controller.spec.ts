import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = { id: 1, ...createUserDto };

      mockUserService.create.mockResolvedValue(createdUser);

      expect(await controller.create(createUserDto)).toEqual(createdUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
      mockUserService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockUserService.findOne.mockResolvedValue(user);

      expect(await controller.findOne('1')).toEqual(user);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUserService.update.mockResolvedValue(updatedUser);

      expect(await controller.update('1', updateUserDto)).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
