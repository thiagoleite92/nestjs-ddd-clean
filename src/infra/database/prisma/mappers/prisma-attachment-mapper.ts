import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
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
