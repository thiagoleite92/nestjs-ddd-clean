import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/prisma/database.module'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const user = await studentFactory.makePrismaStudent({
      password: await hash('123123', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: '123123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
