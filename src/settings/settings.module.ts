import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entitys/settings.entitys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settings])
  ],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
