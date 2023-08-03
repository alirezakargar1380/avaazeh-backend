import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableSettingsAcc } from './entitys/variable_settings.acc.entity';
import { VariableSettingsAccService } from './variable_settings-acc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VariableSettingsAcc
    ])
  ],
  providers: [VariableSettingsAccService]
})
export class VariableSettingsAccModule {}
