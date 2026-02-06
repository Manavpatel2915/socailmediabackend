import { Body, Controller, Get, Header, Path, Post, Route, SuccessResponse, Tags } from 'tsoa';

interface RegisterRequest {
  user_name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'user';
}

interface LoginRequest {
  email: string;
  password: string;
}

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @SuccessResponse('201', 'Created')
  @Post('register')
  public async register(@Body() _body: RegisterRequest): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Post('login')
  public async login(@Body() _body: LoginRequest): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Get('delete/{id}')
  public async deleteUser(
    @Path('id') _id: number,
    @Header('Authorization') _authorization?: string
  ): Promise<void> {
    return;
  }
}

