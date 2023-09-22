import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

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
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
  ): Promise<AuthenticateResponse> {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) throw new UnauthorizedException('User credentials do not match')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid)
      throw new UnauthorizedException('User credentials do not match')

    const accessToken = await this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
