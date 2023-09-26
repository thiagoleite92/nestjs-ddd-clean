import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  static toHTTP({ id, content, createdAt, updatedAt }: Comment<any>) {
    return {
      id,
      content,
      updatedAt,
      createdAt,
    }
  }
}
