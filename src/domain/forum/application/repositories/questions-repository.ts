import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/questions'

export interface QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>
  findById(questionId: string): Promise<Question | null>
  fetchManyRecent(params: PaginationParams): Promise<Question[]>
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
