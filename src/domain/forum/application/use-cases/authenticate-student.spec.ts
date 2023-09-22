import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Use Case -> Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to create a register a new student', async () => {
    const student = makeStudent({
      password: await fakeHasher.hash('123123'),
      email: 'fulano@gmail.com',
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: student.email,
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
