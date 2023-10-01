import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Fetch Question Comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:answerId/comments', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })

    const [c1, c2] = await Promise.all([
      await answerCommentFactory.makePrismaAnswerComment({
        authorId: student.id,
        answerId: answer.id,
      }),
      await answerCommentFactory.makePrismaAnswerComment({
        authorId: student.id,
        answerId: answer.id,
      }),
    ])

    const answerId = answer.id.toString()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    const commentOnDatabse = await prisma.comment.findMany({
      where: { id: answerId },
    })

    expect(commentOnDatabse).toBeDefined()
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: c2.content }),
        expect.objectContaining({ content: c1.content }),
      ]),
    })
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: c2.content,
          authorName: student.name,
        }),
        expect.objectContaining({
          content: c1.content,
          authorName: student.name,
        }),
      ]),
    })
  })
})
