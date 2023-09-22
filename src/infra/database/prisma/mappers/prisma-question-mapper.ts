import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/questions'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain({
    title,
    content,
    authorId,
    createdAt,
    id,
    slug,
    updatedAt,
    bestAnswerId,
  }: PrismaQuestion): Question {
    return Question.create(
      {
        title,
        content,
        authorId: new UniqueEntityID(authorId),
        slug: Slug.create(slug),
        createdAt,
        updatedAt,
        ...(bestAnswerId && {
          bestAnswerId: new UniqueEntityID(bestAnswerId) ?? null,
        }),
      },
      new UniqueEntityID(id),
    )
  }

  static toPrisma({
    authorId,
    bestAnswerId,
    content,
    title,
    id,
    slug,
    createdAt,
    updatedAt,
  }: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: id.toString(),
      authorId: authorId.toString(),
      bestAnswerId: bestAnswerId?.toString(),
      title,
      content,
      slug: slug.value,
      createdAt,
      updatedAt,
    }
  }
}
