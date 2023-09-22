import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class HashComparer {
  abstract hash(plain: string): Promise<string>
}
