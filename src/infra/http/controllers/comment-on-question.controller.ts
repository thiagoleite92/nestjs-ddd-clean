import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const CommentOnQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof CommentOnQuestionBodySchema>

type CommentOnQuestionResponse = void

@Controller('/questions/:id/comments')
export class CommentOnQuestionController {
  constructor(private CommentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(CommentOnQuestionBodySchema))
    body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ): Promise<CommentOnQuestionResponse> {
    const { content } = body

    const { sub: authorId } = user

    const result = await this.CommentOnQuestion.execute({
      questionId,
      authorId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
