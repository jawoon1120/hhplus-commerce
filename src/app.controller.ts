import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('kafka')
  getKafka(): string {
    this.kafkaClient.emit('TEST', {
      message: 'Hello World',
    });
    return 'Hello World';
  }

  async onModuleInit(): Promise<void> {
    const topic = ['TEST'];
    topic.forEach((t) => this.kafkaClient.subscribeToResponseOf(t));
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }
}
