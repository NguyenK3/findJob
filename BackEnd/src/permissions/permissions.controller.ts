import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage('Create A Permission')
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUsers) {
    let newPermission = await this.permissionsService.create(createPermissionDto, user);
    return {
      data: {
        _id: newPermission?._id,
        createdAt: newPermission?.createdAt
      }
    }
  }

  @Get()
  @ResponseMessage('Fetch Permission With Paginate')
  async findAll(
    @Query('current') currentPage: string, 
    @Query('pageSize') limit: string, 
    @Query() qs: string
  ) {
    return await this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch A Permission')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update A Permission')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUsers) {
    return await this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete A Permission')
  async remove(@Param('id') id: string, @User() user: IUsers) {
    return await this.permissionsService.remove(id, user);
  }
}
