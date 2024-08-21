import { Controller, Injectable, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compare, compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassWord = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassWord(createUserDto.password)
    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      username: createUserDto.username
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found users'
    return this.userModel.findOne({ _id: id });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  remove(id: string) {
    // console.log(mongoose.Types.ObjectId.isValid(id))
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found users'
    return this.userModel.softDelete({ _id: id });
  }

  isValidEmail(email: string) {
    return this.userModel.findOne({ email: email })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
}
