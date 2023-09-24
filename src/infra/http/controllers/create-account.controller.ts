import { Body, Controller, Post, HttpCode, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { Student } from '@/domain/forum/enterprise/entities/student'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

type CreateAccountResponse = {
  student: Partial<Student>
}

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(
    @Body() body: CreateAccountBodySchema,
  ): Promise<CreateAccountResponse> {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      throw new Error('deu ruim')
    }

    const { student } = result.value

    return {
      student: { email: student.email, name: student.name },
    }
  }
}
