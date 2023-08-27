import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UsersChart } from './dto/users.dto';
import { User } from './entitys/users.entity';
import { JwtService } from '@nestjs/jwt';
import paginationHelper from "pagination-helper";
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
      active: null,
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

  findAll(perPage: number, page: number, query: any): Promise<User[]> {
    let pagination = new paginationHelper({
      numberOfDataPerPage: perPage,
      current_page_number: page
    })
    
    let role: any = {}
    if (query.role) role = { id: Number(query.role) }

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

  count(query: any) {
    let role: any = {}
    if (query.role) role = { id: Number(query.role) }

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

  findOne(condition: any): Promise<User> {
    return this.usersRepository.findOne({
      where: condition,
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