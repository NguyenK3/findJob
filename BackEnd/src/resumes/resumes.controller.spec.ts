import { Test, TestingModule } from '@nestjs/testing';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';

describe('ResumesController', () => {
    let controller: ResumesController;
    let service: ResumesService;

    const mockResumesService = {
        create: jest.fn(dto => {
            return {
                _id: '1',
                createdAt: new Date()
            };
        }),
        findAll: jest.fn(() => []),
        findOne: jest.fn(id => {
            return { id };
        }),
        update: jest.fn((id, status, user) => {
            return { id, status, user };
        }),
        remove: jest.fn(id => {
            return { id };
        }),
        findByUser: jest.fn(user => {
            return { user };
        }),
        findUserByCompanyId: jest.fn((companyId, currentPage, limit) => {
            return { companyId, currentPage, limit };
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ResumesController],
            providers: [
                {
                    provide: ResumesService,
                    useValue: mockResumesService
                }
            ]
        }).compile();

        controller = module.get<ResumesController>(ResumesController);
        service = module.get<ResumesService>(ResumesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a new resume', async () => {
        const createResumeDto: CreateResumeDto = {
            url: 'test.com',
            companyId: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
            jobId: new mongoose.Schema.Types.ObjectId('6721b00c2ceebb133a850e01'),
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
        const result = await controller.create(createResumeDto, user);
        expect(result.data._id).toBe('1');
        expect(result.data.createdAt).toBeDefined();
    });

    it('should fetch all resumes with pagination', async () => {
        const result = await controller.findAll('1', '10', '');
        expect(result).toEqual([]);
    });

    it('should fetch a single resume by id', async () => {
        const result = await controller.findOne('1');
        expect(result).toEqual({ id: '1' });
    });

    it('should update a resume', async () => {
        const updateResumeDto: UpdateResumeDto = {
            url: 'test.com',
            companyId: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
            jobId: new mongoose.Schema.Types.ObjectId('6721b00c2ceebb133a850e01'),
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
        const result = await controller.update('1', 'updated', user);
        expect(result).toEqual({ id: '1', status: 'updated', user });
    });

    it('should delete a resume', async () => {
        const user: IUsers = {
            _id: 'userObjectId',
            email: 'user@gmail.com',
            name: 'Test User',
            role: {
                _id: 'roleId',
                name: 'Test Role'
            }
        };
        const result = await controller.remove('1', user);
        expect(result).toEqual({ id: '1' });
    });

    it('should get a resume by user', async () => {
        const user: IUsers = {
            _id: 'userObjectId',
            email: 'user@gmail.com',
            name: 'Test User',
            role: {
                _id: 'roleId',
                name: 'Test Role'
            }
        };
        const result = await controller.getResumeByUser(user);
        expect(result).toEqual({ user });
    });

    it('should get a resume by company', async () => {
        const result = await controller.getResumeByCompany('1', '1', '10');
        expect(result).toEqual({ companyId: '1', currentPage: 1, limit: 10 });
    });
});