import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly subscriberClient: Redis;
  private readonly publisherClient: Redis;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    this.subscriberClient = redisClient.duplicate();
    this.publisherClient = redisClient.duplicate();
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    return this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.redisClient.publish(channel, message);
  }

  async subcribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    this.redisClient.subscribe(channel, (err) => {
      if (err) {
        console.error('Failed to subscribe to channel:', err);
      } else {
        console.log(`Subscribed to channel: ${channel}`);
      }
    });

    this.redisClient.on('message', (chan, message) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }
}
