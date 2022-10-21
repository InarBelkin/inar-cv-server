import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const user = (
      await this.usersRepository.find({
        where: { username: username },
      })
    )[0];
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = (
      await this.usersRepository.find({
        where: { email: email },
      })
    )[0];
    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = (
      await this.usersRepository.find({
        where: { id: id },
      })
    )[0];
    return user;
  }

  async create(data: User) {
    const createdUser = await this.usersRepository.save(data);
    return { inserted: createdUser };
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const user = (
      await this.usersRepository.find({ where: { id: userId } })
    )[0];
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
