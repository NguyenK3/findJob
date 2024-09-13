import { BadRequestException, Controller, Injectable, Patch } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { compare, compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUsers } from './interface/users.interface';
import { User } from 'src/customize/customizeDecoration';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { error, log } from 'console';

@Injectable()
export class UsersService {

  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassWord = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDto: CreateUserDto, @User() user: IUsers) {
    const { email, password, name, age, gender, address, role, company } = createUserDto
    const isExistEmail = await this.userModel.findOne({ email });
    // Kiểm tra đối tượng user
    if (!user || !user._id) {
      throw new BadRequestException(`${user} information is missing or invalid`);
    }

    if (isExistEmail) {
      throw new BadRequestException(`${email} is already exists`);
    }
    const hashPassword = this.getHashPassWord(password)
    const newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name, age, gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, age, gender, address } = registerUserDto;
    const isExistEmail = await this.userModel.findOne({ email });
    if (isExistEmail) {
      throw new BadRequestException(`${email} is already exists`);
    }
    const hashPassword = this.getHashPassWord(password);
    const user = await this.userModel.create({
      email,
      password: hashPassword,
      name, age, gender, address,
      role: 'USER'
    })

    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    //Delete original start
    delete filter.current
    delete filter.pageSize

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password')
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid user ID');
    return this.userModel.findOne({ _id: id }).select('-password');
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUsers) {
    if (!user || !user._id) {
      throw new BadRequestException(`${user} information is missing or invalid`);
    }
    const updateUser = await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return updateUser
  }

  async remove(id: string, @User() user: IUsers) {
    // console.log(mongoose.Types.ObjectId.isValid(id))
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid user ID');
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    const deleteUser = await this.userModel.softDelete({ _id: id });
    return deleteUser
  }

  isValidEmail(email: string) {
    return this.userModel.findOne({ email: email })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  updateUserRefreshToken = async (_id: string, refreshToken: string) => {
    return await this.userModel.updateOne({ _id: _id }, { refreshToken })
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }
}