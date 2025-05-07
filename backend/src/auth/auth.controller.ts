import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Alice' },
        email: { type: 'string', example: 'alice@example.com' },
        password: { type: 'string', example: 'securePass123' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(name, email, password);
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'alice@example.com' },
        password: { type: 'string', example: 'securePass123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns access token and user info',
    schema: {
      example: {
        access_token: 'jwt.token.here',
        user: {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
        },
      },
    },
  })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile',
    schema: {
      example: {
        userId: 1,
        name: 'Alice',
        email: 'alice@example.com',
      },
    },
  })
  getProfile(@Request() req) {
    const { id, name, email } = req.user;
    return { userId: id, name, email };
  }
}
