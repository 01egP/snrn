import { config } from 'dotenv';
import { join } from 'path';

export default async () => {
  config({ path: join(__dirname, '../.env.test') });
};
