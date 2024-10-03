import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit{
   private readonly logger = new Logger(DatabasesService.name)
   constructor(
      @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
      @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
      @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
      private configServices: ConfigService,
      private userServices: UsersService
   ) { }

   onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}