import axios from 'axios';
import { Transaction } from '../interfaces/transaction';

const API_URL = `${process.env.REACT_APP_API_URL}transaction`;

export const TransactionService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get<Transaction[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async getTransactionsByUserId(): Promise<Transaction[]> {
    try {
      const userId = localStorage.getItem('userID');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      const response = await axios.get<Transaction[]>(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },

  async createTransaction(
    transactionData: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    try {
      const response = await axios.post<Transaction>(API_URL, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};
