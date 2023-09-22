import { Either, left, right } from './either'

const doSomething = (shouldSuccess: boolean): Either<string, string> =>
  shouldSuccess ? right('success') : left('error')

it('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

it('error result', () => {
  const result = doSomething(false)

  expect(result.isRight()).toBe(false)
  expect(result.isLeft()).toBe(true)
})
