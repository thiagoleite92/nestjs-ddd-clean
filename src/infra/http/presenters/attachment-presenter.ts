import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {
  static toHTTP({ id, url, title }: Attachment) {
    return {
      id: id.toString(),
      url,
      title,
    }
  }
}
