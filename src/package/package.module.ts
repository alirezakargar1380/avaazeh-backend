import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entitys/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package
    ])
  ],
  controllers: [PackageController],
  providers: [PackageService]
})
export class PackageModule { }
