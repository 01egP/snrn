import { Injectable, Logger } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(private readonly configService: NestConfigService) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.configService.get<string>(key);
    if (!value && throwOnMissing) {
      this.logger.error(`Missing environment variable: ${key}`);
      throw new Error(`Config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    this.logger.log('All required environment variables are present.');
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    this.logger.log('Using standard database connection settings.');

    return {
      type: 'mysql',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT'), 10),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  }
}
