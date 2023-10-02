import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain({
    content,
    authorId,
    createdAt,
    id,
    updatedAt,
    questionId,
  }: PrismaComment): QuestionComment {
    if (!questionId) {
      throw new Error('Invalid comment type')
    }
    return QuestionComment.create(
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

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt
        ? questionComment.updatedAt
        : undefined,
    }
  }
}
