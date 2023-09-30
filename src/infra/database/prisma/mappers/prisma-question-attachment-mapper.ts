import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

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

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map(({ attachmentId }) =>
      attachmentId.toString(),
    )

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        questionId: attachments[0]?.questionId.toString(),
      },
    }
  }
}
