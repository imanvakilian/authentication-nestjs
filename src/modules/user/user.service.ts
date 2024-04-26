import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { conflictMessage, notFoundMessage } from 'src/common/messages/index.message';
import { UpdateUserDto } from './dto/user.dto';
import { TuserFindQuery } from './types/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) { }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(notFoundMessage.user);
    return user;
  }

  async findOneWithRelation(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['otp'],
    });
    if (!user) throw new NotFoundException(notFoundMessage.user);
    return user;
  }

  async findOneByQuery(query: TuserFindQuery) {
    const user = await this.userRepository.findOneBy(query);
    if (!user) throw new NotFoundException(notFoundMessage.user);
    return user;
  }

  async checExist(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) throw new ConflictException(conflictMessage.user);
    return null;
  }

  async checExistByQuery(query: TuserFindQuery) {
    const user = await this.userRepository.findOneBy(query);
    if (user) throw new ConflictException(conflictMessage.user);
    return null;
  }

  async checExistByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException(conflictMessage.user);
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
