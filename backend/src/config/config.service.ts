// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
require('dotenv').config();

@Injectable()
export class ConfigService {
  constructor(
    private env: { [k: string]: string | undefined },
    private readonly logger: Logger,
  ) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development, disable in production
      logging: true,
    };
  }
}

const configService = new ConfigService(process.env, new Logger()).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
]);

export { configService };
