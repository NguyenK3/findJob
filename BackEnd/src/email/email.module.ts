// BackEnd/src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService], // Export EmailService
})
export class EmailModule { }