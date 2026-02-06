import { Body, Controller, Get, Header, Patch, Path, Post, Route, SuccessResponse, Tags } from 'tsoa';

interface CreatePostRequest {
  title?: string;
  content: string;
  image?: string;
}

interface UpdatePostRequest {
  title?: string;
  content?: string;
  image?: string;
}

@Route('post')
@Tags('Post')
export class PostController extends Controller {
  @SuccessResponse('201', 'Created')
  @Post('createpost')
  public async createPost(
    @Header('Authorization') _authorization: string,
    @Body() _body: CreatePostRequest
  ): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Get('{postid}')
  public async getPost(@Path('postid') _postid: number): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Get('delete/{postid}')
  public async deletePost(
    @Path('postid') _postid: number,
    @Header('Authorization') _authorization: string
  ): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Patch('updatepost/{postid}')
  public async updatePost(
    @Path('postid') _postid: number,
    @Header('Authorization') _authorization: string,
    @Body() _body: UpdatePostRequest
  ): Promise<void> {
    return;
  }
}

