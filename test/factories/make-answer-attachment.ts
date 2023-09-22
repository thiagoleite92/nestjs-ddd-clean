import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentsProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export const makeAnswerAttachment = (
  override: Partial<AnswerAttachmentsProps> = {},
  id?: UniqueEntityID,
) =>
  AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
