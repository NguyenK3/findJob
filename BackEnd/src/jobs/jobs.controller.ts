import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Create A New Jobs')
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUsers) {
    let newJobs = await this.jobsService.create(createJobDto, user)
    return {
      data: {
        _id: newJobs?._id,
        createAt: newJobs?.createdAt
      }
    }
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch A Job With Paginate')
  async findAll(
    @Query('current') currentPage: string, 
    @Query('pageSize') limit: string, 
    @Query() qs: string) {
    return await this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch A User By Id')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update A Job')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUsers) {
    let updateJob = await this.jobsService.update(id, { ...updateJobDto }, user);
    return updateJob
  }

  @Delete(':id')
  @ResponseMessage('Delete A Job')
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.jobsService.remove(id, user);
  }
}
