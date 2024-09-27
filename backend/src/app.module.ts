import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from '../src/user/user.controller'; // Adjust path as necessary
import { UserService } from '../src/user/user.service';
import { User } from './entities/user.entity'; // adjust as necessary
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql', // type casting to match the expected type
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User], // Ensure you list your entities here
      synchronize: true, // Note: Only use synchronize: true in development
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
