import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUsers } from 'src/users/interface/users.interface';
import mongoose from 'mongoose';

describe('RolesController', () => {
    let controller: RolesController;
    let service: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                {
                    provide: RolesService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RolesController>(RolesController);
        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new role', async () => {
            const createRoleDto: CreateRoleDto = {
                name: 'Admin',
                description: 'Admin role',
                isActive: true,
                permissions: [
                    new mongoose.Schema.Types.ObjectId('67376f28cd97072975c9c37c')
                ]
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

            expect(await controller.create(createRoleDto, user)).toEqual({
                data: {
                    _id: result._id,
                    createdAt: result.createdAt,
                },
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of roles', async () => {
            const result = [{ name: 'Admin' }];
            jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

            expect(await controller.findAll('1', '10', '')).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single role', async () => {
            const result = { name: 'Admin' };
            jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

            expect(await controller.findOne('1')).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a role', async () => {
            const updateRoleDto: UpdateRoleDto = { name: 'User' };
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            const result = { name: 'User' };

            jest.spyOn(service, 'update').mockResolvedValue(result as any);

            expect(await controller.update('1', updateRoleDto, user)).toBe(result);
        });
    });

    describe('remove', () => {
        it('should remove a role', async () => {
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
});