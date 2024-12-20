import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { IUsers } from './interface/users.interface';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
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

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@gmail.com',
                password: '123456',
                name: 'Test',
                age: 20,
                address: 'Test Address',
                gender: 'Male',
                role: 'Normal User',
                company: {
                    _id: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
                    name: 'Lazada Việt Nam'
                },
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
            jest.spyOn(service, 'create').mockResolvedValue(user as any);

            expect(await controller.create(createUserDto, user)).toEqual({
                data: {
                    _id: user._id,
                    email: user.email,
                },
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = [{ _id: '1', email: 'test@example.com' }];
            jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

            expect(await controller.findAll('1', '10', '')).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single user', async () => {
            const result = { _id: '1', email: 'test@example.com' };
            jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

            expect(await controller.findOne('1')).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {
                _id: new mongoose.Schema.Types.ObjectId('6736c1db9933624758257f87').toString(),
                email: 'test@gmail.com',
                name: 'Test',
                age: 20,
                address: 'Test Address',
                gender: 'Male',
                role: 'Normal User',
                company: {
                    _id: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
                    name: 'Lazada Việt Nam'
                },
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
            jest.spyOn(service, 'update').mockResolvedValue(user as any);

            expect(await controller.update(updateUserDto, user)).toBe(user);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const result = { deleted: true };
            const user: IUsers = {
                _id: 'userObjectId',
                email: 'user@gmail.com',
                name: 'Test User',
                role: {
                    _id: 'roleId',
                    name: 'Test Role'
                }
            };
            jest.spyOn(service, 'remove').mockResolvedValue(result as any);

            expect(await controller.remove('1', user)).toBe(result);
        });
    });
});