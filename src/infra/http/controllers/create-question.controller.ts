import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

type CreateQuestionResponse = void

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ): Promise<CreateQuestionResponse> {
    const { title, content } = body

    const { sub: authorId } = user

    await this.prisma.question.create({
      data: {
        authorId,
        title,
        content,
        slug: this.createFormatText(title),
      },
    })
  }

  private createFormatText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return slugText
  }
}
