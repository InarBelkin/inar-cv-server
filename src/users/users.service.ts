import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username })
      .getOne();
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    return user;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = (await this.usersRepository.find({ where: { id } }))[0];
    return user;
  }

  async create(data: User) {
    const createdUser = await this.usersRepository.save(data);
    return { inserted: createdUser };
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const user = await this.findById(userId);
    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }

  async activate(activationCode: string) {
    const user = (
      await this.usersRepository.find({
        where: { activationCode },
      })
    )[0];
    if (!user) {
      throw new NotFoundException('User with this code not found');
    }
    user.isActivated = true;
    await this.usersRepository.save(user);
  }
}
