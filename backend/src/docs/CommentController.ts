import { Body, Controller, Get, Header, Path, Post, Route, SuccessResponse, Tags, Patch } from 'tsoa';

interface CreateCommentRequest {
  Comment: string;
}

interface UpdateCommentRequest {
  Comment: string;
}

@Route('comment')
@Tags('Comment')
export class CommentController extends Controller {
  /**
   * Create a new comment on a post.
   */
  @SuccessResponse('201', 'Comment created successfully')
  @Post('create_comment/{postId}')
  public async createComment(
    @Path() postId: number,
    @Header('Authorization') _auth: string | undefined,
    @Body() _body: CreateCommentRequest
  ): Promise<void> {
    return;
  }

  /**
   * Update an existing comment.
   */
  @SuccessResponse('200', 'Comment updated successfully')
  @Patch('update_comment/{commentId}')
  public async updateComment(
    @Path() commentId: number,
    @Header('Authorization') _auth: string,
    @Body() _body: UpdateCommentRequest
  ): Promise<void> {
    return;
  }

  /**
   * Delete a comment by ID.
   */
  @SuccessResponse('200', 'Comment deleted successfully')
  @Get('delete_comment/{id}')
  public async deleteComment(
    @Path() id: number,
    @Header('Authorization') _auth: string
  ): Promise<void> {
    return;
  }
}

