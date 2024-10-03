import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/customize/customizeDecoration';
import { IUsers } from 'src/users/interface/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { path } from 'path';
import { path } from 'path';

@Injectable()
export class ResumesService {

  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(createResumeDto: CreateResumeDto, @User() user: IUsers) {
    const { url, companyId, jobId } = createResumeDto
    const { _id, email } = user
    const newResumes = await this.resumeModel.create({
      email: user.email,
      url,
      userId: _id,
      status: "PENDING",
      companyId,
      jobId,
      history: [
        {
          status: "PENDING",
          updateAt: new Date,
          updatedBy: {
            _id, email
          }
        }
      ],
      createdBy: {
        _id, email

      }
    })
    return newResumes
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    //Delete original start
    delete filter.current
    delete filter.pageSize

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Job ID');
    return await this.resumeModel.findById(id)
  }

  async update(_id: string, status: string, @User() user: IUsers) {
    if (!user || !user._id) {
      throw new BadRequestException(`${user} information is missing or invalid`);
    }
    const updateResume = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history:
            {
              status,
              createdAt: new Date,
              createdBy: {
                _id: user?._id,
                email: user?.email
              }
            }
        }
      }
    )
    return updateResume
  }

  async remove(_id: string, @User() user: IUsers) {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new BadRequestException('Invalid Job ID');
    await this.resumeModel.updateOne({ _id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    const deleteJob = await this.resumeModel.softDelete({ _id});
    return deleteJob
  }

  async findByUser(user: IUsers) {
    return await this.resumeModel.findOne({
      userId: user?._id
    })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: {name: 1}
        },
        {
          path: "jobId",
          select: {name: 1}
        }
    ])
  }
}
