import { Answer } from '@/domain/forum/enterprise/entities/answers'

export class AnswerPresenter {
  static toHTTP({ id, createdAt, updatedAt, authorId, content }: Answer) {
    return {
      id: id.toString(),
      content,
      createdAt,
      updatedAt,
      authorId: authorId.toString(),
    }
  }
}
