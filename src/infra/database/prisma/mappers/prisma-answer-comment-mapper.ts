import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain({
    content,
    authorId,
    createdAt,
    id,
    updatedAt,
    answerId,
  }: PrismaComment): AnswerComment {
    if (!answerId) {
      throw new Error('Invalid comment type')
    }
    return AnswerComment.create(
      {
        content,
        authorId: new UniqueEntityID(authorId),
        createdAt,
        updatedAt,
        answerId: new UniqueEntityID(answerId),
      },
      new UniqueEntityID(id),
    )
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment?.updatedAt
        ? answerComment?.updatedAt
        : undefined,
    }
  }
}
