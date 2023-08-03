import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsAcc } from './entitys/settings.acc.entity';
import { SettingsAccService } from './settings-acc.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SettingsAcc
        ])
    ],
    providers: [SettingsAccService]
})
export class SettingsAccModule {}
