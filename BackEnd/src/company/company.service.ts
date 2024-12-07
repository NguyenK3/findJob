import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class CompanyService {

  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUsers) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    //Delete original start
    delete filter.current
    delete filter.pageSize

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.companyModel.find(filter)
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
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Company ID');
    const result = await this.companyModel.findById(id)
    return result
  }

  async update(id, updateCompanyDto: UpdateCompanyDto, user: IUsers) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found Job'
    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.companyModel.softDelete(
      { _id: id }
    );
  }

  async findTopCompanies(criteria: 'jobCount' | 'highSalary', limit: number) {
    console.log("criteria", criteria)
    if (!['jobCount', 'highSalary'].includes(criteria)) {
      throw new BadRequestException('Invalid criteria');
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new BadRequestException('Limit must be a positive integer');
    }

    let companies;

    if (criteria === 'jobCount') {
      companies = await this.companyModel.aggregate([
        {
          $addFields: {
            companyObjectId: { $toString: "$_id" }  // Chuyển đổi _id thành string
          }
        },
        {
          $lookup: {
            from: "jobs",  // Collection cần nối
            localField: "companyObjectId",  // Trường trong collection1
            foreignField: "company._id", // Trường trong collection2
            as: "jobs_data"      // Alias để chứa kết quả nối
          }
        },
        {
          $match: {
            "jobs_data": { $ne: [] }  // Kiểm tra xem có dữ liệu nối hay không
          }
        },
        {
          $addFields: {
            jobCount: { $size: '$jobs_data' }
          }
        },
        {
          $sort: { jobCount: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 1,
            name: 1,
            jobCount: 1
          }
        }
      ]);
    } else if (criteria === 'highSalary') {
      companies = await this.companyModel.aggregate([
        {
          $addFields: {
            companyObjectId: { $toString: "$_id" }  // Chuyển đổi _id thành string
          }
        },
        {
          $lookup: {
            from: "jobs",  // Collection cần nối
            localField: "companyObjectId",  // Trường trong collection1
            foreignField: "company._id", // Trường trong collection2
            as: "jobs_data"      // Alias để chứa kết quả nối
          }
        },
        {
          $match: {
            "jobs_data": { $ne: [] }  // Kiểm tra xem có dữ liệu nối hay không
          }
        },
        {
          $addFields: {
            maxSalary: { $max: '$jobs_data.salary' }
          }
        },
        {
          $sort: { maxSalary: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 1,
            name: 1,
            maxSalary: 1
          }
        }
      ]);
    }

    // Log từng giá trị trong kết quả
    // companies.forEach(company => {
    //   console.log(`Company ID: ${company._id}`);
    //   console.log(`Jobs: ${JSON.stringify(company.jobs_data, null, 2)}`);
    // });

    return companies;
  }
}