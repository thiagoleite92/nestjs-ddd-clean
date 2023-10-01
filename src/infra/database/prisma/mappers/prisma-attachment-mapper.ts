import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain({ title, url, id }: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title,
        url,
      },
      new UniqueEntityID(id),
    )
  }

  static toPrisma({
    title,
    url,
    id,
  }: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: id.toString(),
      title,
      url,
    }
  }
}
