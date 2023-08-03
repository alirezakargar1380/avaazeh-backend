import { Module } from '@nestjs/common';
import { UsersAccService } from './users-acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAcc } from 'src/users-acc/entitys/users.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersAcc
    ])
  ],
  providers: [UsersAccService]
})
export class UsersAccModule {}
