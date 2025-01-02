import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/configs/configs.service';

@Module({
  imports: [TypeOrmModule.forRootAsync(AppConfigService.getDatabaseConfigs())],
})
export class DatabaseModule {}
