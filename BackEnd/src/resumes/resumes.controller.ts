import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create A New Resume')
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUsers) {
    let newResume = await this.resumesService.create(createResumeDto, user);
    return {
      data: {
        _id: newResume?._id,
        createdAt: newResume?.createdAt
      }
    }
  }

  @Get()
  @ResponseMessage('Fetch A Resumes With Paginate')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body("status") status: string, @User() user: IUsers) {
    return await this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUsers) {
    return await this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Get A Resume By User')
  async getResumeByUser(@User() user: IUsers) {
    return this.resumesService.findByUser(user)
  }

  @Post('by-company')
  @ResponseMessage('Get A Resume By Company')
  async getResumeByCompany(
    @Body('companyId') companyId: string,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string) {
    return this.resumesService.findUserByCompanyId(companyId, +currentPage, +limit)
  }
}
