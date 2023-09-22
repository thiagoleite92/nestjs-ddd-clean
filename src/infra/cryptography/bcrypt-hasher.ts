import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcrypterHasher implements HashGenerator, HashComparer {
  private HASH_SALT_ROUNDS = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_ROUNDS)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
