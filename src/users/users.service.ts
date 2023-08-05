import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UsersChart } from './dto/users.dto';
import { User } from './entitys/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import paginationHelper from "pagination-helper";
import { UsersAcc } from 'src/users-acc/entitys/users.acc.entity';
import p_date from './../shared/utils/persionDate.utility';
import persionDateUtility from './../shared/utils/persionDate.utility';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async get_sum(): Promise<UsersChart[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select('COUNT(*) AS numberOfReports')
      .addSelect('user.month')
      .where(`user.year = ${persionDateUtility.year}`)
      .groupBy('user.month')
      .getRawMany()
  }

  save(data: CreateUserDto | any): Promise<User> {
    return this.usersRepository.save({
      ...data,
      year: p_date.year,
      month: p_date.month
    })
  }

  async updatePassword(userId: number, password: string) {
    // let bcryptedPass: string = ""
    // const saltRounds: number = 10
    // bcryptedPass = await bcrypt.genSalt(saltRounds).then((salt: string) => {
    //   return bcrypt.hash(password, salt)
    // }).then((hash: string) => {
    //   return hash
    // })

    // await this.usersRepository.update({ id: userId }, {
    //   password: bcryptedPass
    // })
  }

  findAll(perPage: number, page: number, query: any, usersAcc: UsersAcc, all_organ_access: boolean, organ_id: number): Promise<User[]> {
    let pagination = new paginationHelper({
      numberOfDataPerPage: perPage,
      current_page_number: page
    })

    let organization: any = {}
    let role: any = {}
    if (usersAcc.get) {
      organization = { id: Number(organ_id) }
      if (query.role) role = { id: Number(query.role) }
    }
    if (all_organ_access) {
      organization = {}
      if (query.organization) organization = { id: Number(query.organization) }
      if (query.role) role = { id: Number(query.role) }
    }

    return this.usersRepository.find({
      relations: {
        role: true
      },
      where: {
        role: role
      },
      select: {
        fullName: true,
        id: true,
        role: {
          title: true
        },
        phone: true,
        active: true
      },
      take: pagination.getTakeAndSkip().take,
      skip: pagination.getTakeAndSkip().skip
    });
  }

  count(query: any, usersAcc: UsersAcc, all_organ_access: boolean, organ_id: number) {
    let organization: any = {}
    let role: any = {}
    if (usersAcc.get) {
      organization = { id: Number(organ_id) }
      if (query.role) role = { id: Number(query.role) }
    }
    if (all_organ_access) {
      organization = {}
      if (query.organization) organization = { id: Number(query.organization) }
      if (query.role) role = { id: Number(query.role) }
    }

    return this.usersRepository.count({
      relations: {
        role: true
      },
      where: {
        role: role
      }
    })
  }

  update(id: number, data: any) {
    return this.usersRepository.update({ id: id }, data)
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: {
        role: true
      },
      select: {
        active: true,
        email: true,
        fullName: true,
        id: true,
        phone: true,
        role: {
          id: true
        }
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}