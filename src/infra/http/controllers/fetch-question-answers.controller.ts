import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { Answer } from '@prisma/client'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

type FetchQuestionAnswersResponse = {
  answers: Partial<Answer>[]
}

@Controller('/questions/:id/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('id') questionId: string,
  ): Promise<FetchQuestionAnswersResponse> {
    const result = await this.fetchQuestionAnswers.execute({ page, questionId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
