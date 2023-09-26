import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Fetch Question Comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionCommentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const [c1, c2] = await Promise.all([
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: student.id,
        questionId: question.id,
      }),
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: student.id,
        questionId: question.id,
      }),
    ])

    const questionId = question.id.toString()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log(response)

    expect(response.statusCode).toEqual(200)

    const commentOnDatabse = await prisma.comment.findMany({
      where: { id: questionId },
    })

    expect(commentOnDatabse).toBeDefined()
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: c2.content }),
        expect.objectContaining({ content: c1.content }),
      ]),
    })
  })
})
