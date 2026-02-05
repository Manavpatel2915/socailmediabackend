import { Body, Controller, Delete, Get, Header, Path, Post, Route, SuccessResponse, Tags } from 'tsoa';

interface RegisterRequest {
  user_name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Route('user')
@Tags('User')
export class UserController extends Controller {
 
  @SuccessResponse('201', 'User registered successfully')
  @Post('register')
  public async register(@Body() _body: RegisterRequest): Promise<void> {
    return;
  }


  @SuccessResponse('200', 'User logged in successfully')
  @Post('login')
  public async login(@Body() _body: LoginRequest): Promise<void> {
    return;
  }


  @SuccessResponse('201', 'User deleted successfully')
  @Get('delete/{id}')
  public async deleteUser(
    @Path() id: number,
    @Header('Authorization') _auth?: string
  ): Promise<void> {
    return;
  }
}

