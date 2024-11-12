import axios from 'axios';
import { Budget } from '../types/budget';

const API_URL = `${process.env.REACT_APP_API_URL}budget`;

export const BudgetService = {
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await axios.get<Budget[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  async createBudget(budgetData: Omit<Budget, 'id'>): Promise<Budget> {
    try {
      const response = await axios.post<Budget>(API_URL, budgetData);
      console.log('Created Budget:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },
};
