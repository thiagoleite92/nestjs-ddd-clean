import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): QuestionComment {
    const questioncomment = new QuestionComment(
      { ...props, createdAt: props?.createdAt ?? new Date() },
      id,
    )

    return questioncomment
  }

  get questionId() {
    return this.props.questionId
  }
}
