// BackEnd/src/auth/password-reset/password-reset.module.ts
import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { UsersModule } from 'src/users/users.module'; // Import UsersModule
import { EmailModule } from 'src/email/email.module'; // Import EmailModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule if not global

@Module({
  imports: [
    UsersModule,  // Add UsersModule to imports
    EmailModule,  // Add EmailModule to imports
    ConfigModule, // Add ConfigModule if it's not globally imported
  ],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
})
export class PasswordResetModule { }