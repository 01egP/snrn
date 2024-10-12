import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as url from 'url';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

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
    const jawsDbUrl = this.env['JAWSDB_URL'];

    if (jawsDbUrl) {
      const dbUrl = url.parse(jawsDbUrl);
      const [username, password] = dbUrl.auth.split(':');

      return {
        type: 'mysql',
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port, 10),
        username,
        password,
        database: dbUrl.pathname.substring(1),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // synchronize: true,
      };
    }

    return {
      type: 'mysql',
      host: this.getValue('DB_HOST') || 'mysql',
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env, new Logger()).ensureValues(
  ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'],
);

export { configService };
