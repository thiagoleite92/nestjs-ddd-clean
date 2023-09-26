import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'

describe('Delete Comment Answer (E2E)', () => {
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
        QuestionFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[Delete] /answers/comments/:answersId', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      authorId: student.id,
      answerId: answer.id,
    })

    const answerCommentId = answerComment.id.toString()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(204)

    const commentOnDatabse = await prisma.comment.findUnique({
      where: { id: answerCommentId },
    })

    expect(commentOnDatabse).toBeNull()
    expect(commentOnDatabse?.content).not.toBeDefined()
  })
})
