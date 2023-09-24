import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const authenticateBodySchema = z.object({
  email: z.any(),
  password: z.any(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

type AuthenticateResponse = {
  access_token: string
}

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
  ): Promise<AuthenticateResponse> {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error('Deu ruim')
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
