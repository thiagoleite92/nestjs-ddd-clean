import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentsProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentsProps> {
  static create(props: QuestionAttachmentsProps, id?: UniqueEntityID) {
    const attachment = new QuestionAttachment(props, id)

    return attachment
  }

  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
