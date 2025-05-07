import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const created = await this.categoryService.create(dto);
    return plainToInstance(CategoryResponseDto, created);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All categories',
    type: [CategoryResponseDto],
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryService.findAll();
    return plainToInstance(CategoryResponseDto, categories);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Category by ID',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryService.findOne(+id);
    return plainToInstance(CategoryResponseDto, category);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Category updated',
    type: CategoryResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const updated = await this.categoryService.update(+id, dto);
    return plainToInstance(CategoryResponseDto, updated);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 204,
    description: 'Category deleted',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(+id);
  }
}
