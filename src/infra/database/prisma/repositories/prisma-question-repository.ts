import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/questions'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    throw new Error('Method not implemented.')
  }

  async findById(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  fetchManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }

  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
