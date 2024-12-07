import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { JobsModule } from 'src/jobs/jobs.module';
import { Jobs, JobsSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule { }
