import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Role.name, schema: RoleSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [RolesController],
  providers: [RolesService, UsersService],
  exports: [RolesService, UsersService]
})
export class RolesModule {}
