import { Module } from '@nestjs/common';
import { PagePackagesController } from './page_packages.controller';
import { PagePackagesService } from './page_packages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagePackage } from './entitys/page_package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PagePackage
    ])
  ],
  controllers: [PagePackagesController],
  providers: [PagePackagesService]
})
export class PagePackagesModule {}
