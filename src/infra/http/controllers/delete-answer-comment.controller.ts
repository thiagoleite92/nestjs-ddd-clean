import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

type DeleteAnswerCommentResponse = void

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private DeleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ): Promise<DeleteAnswerCommentResponse> {
    const { sub: authorId } = user

    const result = await this.DeleteAnswerComment.execute({
      answerCommentId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
