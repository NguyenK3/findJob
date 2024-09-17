import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from './interface/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage('Create A User')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUsers) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      data: {
        _id: newUser?._id,
        email: newUser?.email
      }
    }
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch A User With Paginate')
  async findAll(
    @Query('current') currentPage: string, 
    @Query('pageSize') limit: string, 
    @Query() qs: string) {
    return await this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch A User By Id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Update A User')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUsers) {
    let updateUser = await this.usersService.update({ ...updateUserDto }, user)
    return updateUser
  }

  @Delete(':id')
  @ResponseMessage('Delete A User')
  remove(@Param('id') id: string, @User() user:IUsers) {
    return this.usersService.remove(id, user);
  }
}
