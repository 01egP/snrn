import axios from 'axios';
import { Transaction } from '../types/transaction';

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

  async createTransaction(
    transactionData: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    try {
      const response = await axios.post<Transaction>(API_URL, transactionData);
      console.log('Created Transaction:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};
