import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/questions'

export const makeQuestion = (
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) =>
  Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      attachmentIds: [],
      ...override,
    },
    id,
  )
