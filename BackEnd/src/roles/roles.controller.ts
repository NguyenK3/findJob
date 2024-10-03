import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create A Role')
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUsers) {
    let newRole = await this.rolesService.create(createRoleDto, user);
    return {
      data: {
        _id: newRole?._id,
        createdAt: newRole?.createdAt
      }
    }
  }

  @Get()
  async findAll(
    @Query('current') currentPage: string, 
    @Query('pageSize') limit: string, 
    @Query() qs: string
  ) {
    return await this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch A User By Id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update A Role')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUsers) {
    return await this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete A Role')
  async remove(@Param('id') id: string, @User() user: IUsers) {
    return await this.rolesService.remove(id, user);
  }
}
