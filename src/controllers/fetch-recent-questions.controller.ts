import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Question } from '@prisma/client'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

type CreateQuestionResponse = {
  questions: Question[]
}

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecenteQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ): Promise<CreateQuestionResponse> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      skip: (page - 1) * 1,
    })

    return { questions }
  }
}
