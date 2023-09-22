import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecenteQuestionsUseCaseRequest {
  page: number
}

type FetchRecenteQuestionsUseCaseResponse = Either<
  null,
  { questions: Question[] }
>
@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecenteQuestionsUseCaseRequest): Promise<FetchRecenteQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.fetchManyRecent({ page })

    return right({ questions })
  }
}
