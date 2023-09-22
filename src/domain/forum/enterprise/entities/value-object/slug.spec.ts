import { Slug } from './slug'

describe('Slug Normalize', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFormatText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })
})
