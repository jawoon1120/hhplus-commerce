import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly lockTimeout = 3000; // 10초
  private readonly maxRetries = 5; // 최대 재시도 횟수
  private readonly retryDelay = 100; // 재시도 간격 (1초)

  constructor(@InjectRedis() private readonly client: Redis) {}

  async acquireLock(key: string, timeout = this.lockTimeout): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const lockValue = Date.now().toString();

    try {
      const result = await this.client.set(
        lockKey,
        lockValue,
        'PX',
        timeout,
        'NX',
      );

      return result === 'OK';
    } catch (error) {
      console.error('Failed to acquire lock:', error);
      return false;
    }
  }

  async releaseLock(key: string): Promise<boolean> {
    const lockKey = `lock:${key}`;

    try {
      await this.client.del(lockKey);
      return true;
    } catch (error) {
      console.error('Failed to release lock:', error);
      return false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async withSpinLock<T>(
    key: string,
    action: () => Promise<T>,
  ): Promise<T | null> {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        const acquired = await this.acquireLock(key, this.lockTimeout);

        if (acquired) {
          try {
            const result = await action();
            return result;
          } finally {
            await this.releaseLock(key);
          }
        }

        retries++;
        if (retries < this.maxRetries) {
          await this.delay(this.retryDelay);
        }
      } catch (error) {
        console.error(`Error in attempt ${retries + 1}:`, error);
        retries++;

        if (retries === this.maxRetries) {
          throw error;
        }

        await this.delay(this.retryDelay);
      }
    }

    throw new Error(`Failed to acquire lock after ${this.maxRetries} attempts`);
  }
}
