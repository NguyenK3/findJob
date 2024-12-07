import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobsService } from './jobs.service';

@Injectable()
export class JobsCron {
    constructor(private readonly jobsService: JobsService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Chạy vào lúc 00:00 mỗi ngày
    async handleCron() {
        const now = new Date();
        await this.jobsService.jobModel.updateMany(
            { endDate: { $lt: now }, isActive: true },
            { $set: { isActive: false } }
        );
    }
}