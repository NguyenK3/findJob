import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Jobs, JobsDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {

  constructor(@InjectModel(Jobs.name) public jobModel: SoftDeleteModel<JobsDocument>) { }

  async create(createJobDto: CreateJobDto, @User() user: IUsers) {
    const { name, skills, company, location, salary, quantity,
      level, description, startDate, endDate, isActive } = createJobDto
    const newJobs = await this.jobModel.create({
      name, skills, company, location, salary,
      quantity, level, description, startDate, endDate, isActive,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newJobs
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    //Delete original start
    delete filter.current
    delete filter.pageSize

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
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

  async findAllActiveJobs(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    // Chỉ tìm kiếm các job có isActive là true
    filter.isActive = true;

    let { sort } = aqp(qs);
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-createdAt"
    }
    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Job ID');
    return await this.jobModel.findById(id)
  }

  async update(_id: string, updateJobDto: UpdateJobDto, @User() user: IUsers) {
    if (!user || !user._id) {
      throw new BadRequestException(`${user} information is missing or invalid`);
    }
    const updateJob = await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return updateJob
  }

  async remove(id: string, @User() user: IUsers) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Job ID');
    await this.jobModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    const deleteJob = await this.jobModel.softDelete({ _id: id });
    return deleteJob
  }

  async findJobByCompanyId(companyId: string, currentPage: number, limit: number) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new BadRequestException('Invalid Company ID');
    }

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = await this.jobModel.countDocuments({ 'company._id': companyId });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find({ 'company._id': companyId })
      .skip(offset)
      .limit(defaultLimit)
      .sort("-createdAt")
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }
}
