import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose, { ObjectId } from 'mongoose';

describe('CompanyController', () => {
    let controller: CompanyController;
    let service: CompanyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompanyController],
            providers: [
                {
                    provide: CompanyService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findTopCompanies: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CompanyController>(CompanyController);
        service = module.get<CompanyService>(CompanyService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create with correct parameters', async () => {
            const createCompanyDto: CreateCompanyDto = {
                name: 'Test Company',
                address: 'Test Address',
                description: 'Test Description',
                logo: 'Test Logo'
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
            await controller.create(createCompanyDto, user);
            expect(service.create).toHaveBeenCalledWith(createCompanyDto, user);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll with correct parameters', async () => {
            const currentPage = '1';
            const limit = '10';
            const qs = 'query';
            await controller.findAll(currentPage, limit, qs);
            expect(service.findAll).toHaveBeenCalledWith(+currentPage, +limit, qs);
        });
    });

    describe('findOne', () => {
        it('should call service.findOne with correct id', async () => {
            const id = 'companyId';
            await controller.findOne(id);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should call service.update with correct parameters', async () => {
            const id = 'companyId';
            const updateCompanyDto: UpdateCompanyDto = {
                name: 'Test Company',
                address: 'Test Address',
                description: 'Test Description',
                logo: 'Test Logo'
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
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            await controller.update(id, updateCompanyDto, user);
            expect(service.update).toHaveBeenCalledWith(id, updateCompanyDto, user);
        });

        it('should return "Not found Company" if id is invalid', async () => {
            const id = 'invalidId';
            const updateCompanyDto: UpdateCompanyDto = {
                name: 'Test Company',
                address: 'Test Address',
                description: 'Test Description',
                logo: 'Test Logo'
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
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            const result = await controller.update(id, updateCompanyDto, user);
            expect(result).toBe('Not found Company');
        });
    });

    describe('remove', () => {
        it('should call service.remove with correct parameters', async () => {
            const id = 'companyId';
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
            await controller.remove(id, user);
            expect(service.remove).toHaveBeenCalledWith(id, user);
        });

        it('should return "Not found Company" if id is invalid', async () => {
            const id = 'invalidId';
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
            const result = await controller.remove(id, user);
            expect(result).toBe('Not found Company');
        });
    });

    describe('findTopCompanies', () => {
        it('should call service.findTopCompanies with correct parameters', async () => {
            const criteria = 'jobCount';
            const limit = '5';
            await controller.findTopCompanies(criteria, limit);
            expect(service.findTopCompanies).toHaveBeenCalledWith(criteria, +limit);
        });
    });
});