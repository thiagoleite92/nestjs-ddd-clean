import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP({
    id,
    title,
    slug,
    bestAnswerId,
    createdAt,
    updatedAt,
    authorId,
  }: Question) {
    return {
      id: id.toString(),
      slug: slug.value,
      title,
      bestAnswerId: bestAnswerId?.toString(),
      createdAt,
      updatedAt,
      authorId: authorId.toString(),
    }
  }
}
