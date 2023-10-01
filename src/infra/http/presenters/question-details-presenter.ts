import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP({
    questionId,
    authorId,
    author,
    title,
    content,
    slug,
    bestAnswerId,
    attachments,
    createdAt,
    updatedAt,
  }: QuestionDetails) {
    return {
      questionId: questionId.toString(),
      authorId: authorId.toString(),
      author,
      title,
      content,
      slug: slug.value,
      bestAnswerId: bestAnswerId?.toString(),
      attachments: attachments.map(AttachmentPresenter.toHTTP),
      createdAt,
      updatedAt,
    }
  }
}
