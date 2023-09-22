import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jonas',
      email: 'jonas@gmail.com',
      password: 'Senha@123',
    })

    expect(response.statusCode).toBe(201)

    const userOnDataBase = await prisma.user.findUnique({
      where: { email: 'jonas@gmail.com' },
    })

    expect(userOnDataBase).toBeTruthy()
  })
})
