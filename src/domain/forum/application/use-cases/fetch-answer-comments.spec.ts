import { FetchAnswersCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: FetchAnswersCommentsUseCase

describe('Use Case -> Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswersCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answers comments', async () => {
    const student = makeStudent()

    await inMemoryStudentsRepository.create(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)

    await inMemoryAnswerCommentsRepository.create(comment2)

    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result?.value?.comments).toHaveLength(3)
    expect(result?.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: student.name,
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: student.name,
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: student.name,
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch answers comments paginated', async () => {
    const student = makeStudent()

    await inMemoryStudentsRepository.create(student)

    for (let i = 0; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result?.value?.comments).toHaveLength(3)
  })
})
