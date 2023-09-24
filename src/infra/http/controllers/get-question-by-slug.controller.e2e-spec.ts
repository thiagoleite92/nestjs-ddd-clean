import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /question/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Jonas',
        email: 'jonas@gmail.com',
        password: '123456',
      },
    })
    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          slug: 'question-1',
          content: 'Content 1',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/question/question-1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' }),
    })
  })
})
