import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUsers) {
    return this.companyService.create(createCompanyDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list company with paginatation")
  @Public()
  findAll(
    @Query('current') currentPage: string, 
    @Query('pageSize') limit: string, 
    @Query() qs: string) {
    return this.companyService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUsers) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found Company'
    }
    return this.companyService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUsers) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found Company'
    }
    return this.companyService.remove(id, user);
  }
}
