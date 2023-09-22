import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentsProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export const makeQuestionAttachment = (
  override: Partial<QuestionAttachmentsProps> = {},
  id?: UniqueEntityID,
) =>
  QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
