import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain({ id, questionId }: PrismaAttachment): QuestionAttachment {
    if (!questionId) {
      throw new Error('Invalid comment type')
    }
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(questionId),
        attachmentId: new UniqueEntityID(id),
      },
      new UniqueEntityID(id),
    )
  }
}
