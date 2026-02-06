
import { Body, Controller, Get, Header, Patch, Path, Post, Route, SuccessResponse, Tags } from 'tsoa';

interface CreateCommentRequest {
  Comment: string;
}

interface UpdateCommentRequest {
  Comment: string;
}

@Route('comment')
@Tags('Comment')
export class CommentController extends Controller {
  @SuccessResponse('201', 'Created')
  @Post('create_comment/{postId}')
  public async createComment(
    @Path('postId') _postId: number,
    @Body() _body: CreateCommentRequest,
    @Header('Authorization') _authorization?: string
  ): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Patch('update_comment/{commentId}')
  public async updateComment(
    @Path('commentId') _commentId: number,
    @Header('Authorization') _authorization: string,
    @Body() _body: UpdateCommentRequest
  ): Promise<void> {
    return;
  }

  @SuccessResponse('200', 'OK')
  @Get('delete_comment/{id}')
  public async deleteComment(
    @Path('id') _id: number,
    @Header('Authorization') _authorization: string
  ): Promise<void> {
    return;
  }
}

