import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answers'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain({
    content,
    authorId,
    createdAt,
    id,
    updatedAt,
    questionId,
  }: PrismaAnswer): Answer {
    return Answer.create(
      {
        content,
        authorId: new UniqueEntityID(authorId),
        createdAt,
        updatedAt,
        questionId: new UniqueEntityID(questionId),
      },
      new UniqueEntityID(id),
    )
  }

  static toPrisma({
    authorId,
    content,
    id,
    questionId,
    createdAt,
    updatedAt,
  }: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: id.toString(),
      authorId: authorId.toString(),
      questionId: questionId.toString(),
      content,
      createdAt,
      updatedAt,
    }
  }
}
