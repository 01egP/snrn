import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'API health check',
    schema: {
      example: {
        status: 'ok',
        message: 'API is working',
      },
    },
  })
  getHello(): { status: string; message: string } {
    return this.appService.getHello();
  }
}
