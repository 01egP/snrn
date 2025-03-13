import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// In the test case, run the NODE_ENV manually
// NODE_ENV=test npx ts-node src/data-source.ts

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const configService = new ConfigService();

const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DB_PORT'), 10),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

const AppDataSource = new DataSource(dataSourceConfig);
export default AppDataSource;
