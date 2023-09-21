import { ConflictException, Body, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Email already registered in our system.')
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    return user
  }
}
