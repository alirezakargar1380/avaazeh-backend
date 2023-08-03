import { Module } from '@nestjs/common';
import { RoleAccService } from './role-acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesAcc } from './entitys/roles.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolesAcc
    ])
  ],
  providers: [RoleAccService]
})
export class RoleAccModule {}
