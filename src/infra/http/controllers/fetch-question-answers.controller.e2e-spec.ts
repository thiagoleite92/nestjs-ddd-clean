import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Fetch Question Answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()

    const [a1, a2] = await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: a2.content }),
        expect.objectContaining({ content: a1.content }),
      ]),
    })
  })
})
