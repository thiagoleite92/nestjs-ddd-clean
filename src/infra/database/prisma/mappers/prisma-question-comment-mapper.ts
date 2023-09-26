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

  static toPrisma({
    authorId,
    content,
    id,
    questionId,
    createdAt,
    updatedAt,
  }: QuestionComment): Prisma.CommentUncheckedCreateInput {
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
