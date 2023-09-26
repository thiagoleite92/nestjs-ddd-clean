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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const CommentOnAnswerBodySchema = z.object({
  content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof CommentOnAnswerBodySchema>

type CommentOnAnswerResponse = void

@Controller('/answers/:id/comments')
export class CommentOnAnswerController {
  constructor(private CommentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(CommentOnAnswerBodySchema))
    body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ): Promise<CommentOnAnswerResponse> {
    const { content } = body

    const { sub: authorId } = user

    const result = await this.CommentOnAnswer.execute({
      answerId,
      authorId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
