import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';

describe('JobsController', () => {
    let controller: JobsController;
    let service: JobsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobsController],
            providers: [
                {
                    provide: JobsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findJobByCompanyId: jest.fn(),
                        findAllActiveJobs: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<JobsController>(JobsController);
        service = module.get<JobsService>(JobsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new job', async () => {
            const createJobDto: CreateJobDto = {
                name: 'Test Job',
                skills: [
                    "Node.JS",
                    "Nest.JS",
                    "MongoDB"
                ],
                location: 'Test Location',
                description: 'Test Description',
                salary: 1000,
                quantity: '10',
                level: 'Junior',
                startDate: new Date(),
                endDate: new Date(),
                isActive: true,
                company: {
                    _id: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
                    name: 'Test Company',
                    logo: 'Test Logo'
                }

            };
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            const result = { _id: '1', createdAt: new Date() };

            jest.spyOn(service, 'create').mockResolvedValue(result as any);

            expect(await controller.create(createJobDto, user)).toEqual({
                data: {
                    _id: result._id,
                    createAt: result.createdAt,
                },
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of jobs', async () => {
            const result = [{ id: '1', title: 'Test Job' }];
            jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

            expect(await controller.findAll('1', '10', '')).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single job', async () => {
            const result = { id: '1', title: 'Test Job' };
            jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

            expect(await controller.findOne('1')).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a job', async () => {
            const updateJobDto: UpdateJobDto = {
                name: 'Test Job',
                skills: [
                    "Node.JS",
                    "Nest.JS",
                    "MongoDB"
                ],
                location: 'Test Location',
                description: 'Test Description',
                salary: 1000,
                quantity: '10',
                level: 'Junior',
                startDate: new Date(),
                endDate: new Date(),
                isActive: true,
                company: {
                    _id: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
                    name: 'Test Company',
                    logo: 'Test Logo'
                }
            };
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            const result = { id: '1', title: 'Updated Job' };

            jest.spyOn(service, 'update').mockResolvedValue(result as any);

            expect(await controller.update('1', updateJobDto, user)).toBe(result);
        });
    });

    describe('remove', () => {
        it('should remove a job', async () => {
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            const result = { deleted: true };

            jest.spyOn(service, 'remove').mockResolvedValue(result as any);

            expect(await controller.remove('1', user)).toBe(result);
        });
    });

    describe('findJobByCompanyId', () => {
        it('should return jobs by company id', async () => {
            const result = [{ id: '1', title: 'Test Job' }];
            jest.spyOn(service, 'findJobByCompanyId').mockResolvedValue(result as any);

            expect(await controller.findJobByCompanyId('1', '1', '10')).toBe(result);
        });
    });

    describe('findJobActive', () => {
        it('should return active jobs', async () => {
            const result = [{ id: '1', title: 'Active Job' }];
            jest.spyOn(service, 'findAllActiveJobs').mockResolvedValue(result as any);

            expect(await controller.findJobActive('1', '10', '')).toBe(result);
        });
    });
});