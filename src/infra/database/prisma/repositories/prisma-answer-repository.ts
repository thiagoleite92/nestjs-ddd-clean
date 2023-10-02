import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { Answer } from '@/domain/forum/enterprise/entities/answers'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findById(answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    })

    return answer ? PrismaAnswerMapper.toDomain(answer) : null
  }

  async fetchManyRecent({ page }: PaginationParams): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({ data })

    DomainEvents.dispatchEventsForAggregate(answer.id)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({
        where: { id: data.id },
        data,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.delete({
      where: { id: data.id },
    })
  }
}
