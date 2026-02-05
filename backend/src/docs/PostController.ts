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
  /**
   * Create a new post.
   */
  @SuccessResponse('201', 'Post created successfully')
  @Post('createpost')
  public async createPost(
    @Header('Authorization') _auth: string,
    @Body() _body: CreatePostRequest
  ): Promise<void> {
    return;
  }

  /**
   * Get post by ID.
   */
  @SuccessResponse('200', 'Post fetched successfully')
  @Get('{postid}')
  public async getPost(@Path() postid: number): Promise<void> {
    return;
  }

  /**
   * Delete post by ID.
   */
  @SuccessResponse('200', 'Post deleted successfully')
  @Get('delete/{postid}')
  public async deletePost(
    @Path() postid: number,
    @Header('Authorization') _auth: string
  ): Promise<void> {
    return;
  }

  /**
   * Update post by ID.
   */
  @SuccessResponse('200', 'Post updated successfully')
  @Patch('updatepost/{postid}')
  public async updatePost(
    @Path() postid: number,
    @Header('Authorization') _auth: string,
    @Body() _body: UpdatePostRequest
  ): Promise<void> {
    return;
  }
}

