import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schemas/job.schema';
import { JobsCron } from './jobs.cron';

@Module({
  imports: [MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }])],
  controllers: [JobsController],
  providers: [JobsService, JobsCron],
  exports: [JobsService]
})
export class JobsModule { }
