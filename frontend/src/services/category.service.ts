import axios from 'axios';
import { Category } from '../types/category';

const API_URL = `${process.env.REACT_APP_API_URL}category`;

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await axios.post<Category>(API_URL, categoryData);
      console.log('Created Category:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
};
