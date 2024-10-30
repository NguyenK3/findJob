import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUsers } from 'src/users/interface/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import mongoose from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUsers) {
    const { name, description, isActive, permissions } = createRoleDto
    const isExist = await this.roleModel.findOne({ name })
    if (isExist) {
      throw new BadRequestException('Role with name="${name}" has existed')
    }
    const newRole = this.roleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user?._id,
        email: user?.email
      }
    })
    return newRole;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    //Delete original start
    delete filter.current
    delete filter.pageSize

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.roleModel.find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Role should not found')
    }

    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return role.populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUsers) {
    const { name, description, isActive, permissions } = updateRoleDto
    const isExist = await this.roleModel.findOne({ name })
    // if (isExist) {
    //   throw new BadRequestException('Role with name="${name}" has existed')
    // }
    const newUpdateRole = this.roleModel.updateOne({
      name, description, isActive, permissions,
      updatedBy: {
        _id: user?._id,
        email: user?.email
      }
    })
    return newUpdateRole;
  }

  async remove(id: string, user: IUsers) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid Role ID');
    const foundUser = await this.roleModel.findById(id)
    if (foundUser && foundUser.name == ADMIN_ROLE) {
      throw new BadRequestException("Can't delete account Admin")
    }
    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    const deleteRole = await this.roleModel.softDelete({ _id: id });
    return deleteRole
  }
}
