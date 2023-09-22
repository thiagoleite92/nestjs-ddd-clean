import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/questions'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain({
    title,
    content,
    authorId,
    createdAt,
    id,
    slug,
    updatedAt,
  }: PrismaQuestion): Question {
    return Question.create(
      {
        title,
        content,
        authorId: new UniqueEntityID(authorId),
        bestAnswerId: undefined,
        slug: Slug.create(slug),
        createdAt,
        updatedAt,
      },
      new UniqueEntityID(id),
    )
  }
}
