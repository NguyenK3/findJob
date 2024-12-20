import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { RolesService } from '../roles/roles.service';
import { IUsers } from '../users/interface/users.interface';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let rolesService: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        register: jest.fn(),
                        processNewToken: jest.fn(),
                        logout: jest.fn(),
                    },
                },
                {
                    provide: RolesService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        rolesService = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should call authService.login with correct parameters', async () => {
            const req = { user: {} };
            const res = {} as Response;
            await authController.login(req, res);
            expect(authService.login).toHaveBeenCalledWith(req.user, res);
        });
    });

    describe('register', () => {
        it('should call authService.register with correct parameters', async () => {
            const registerUserDto: RegisterUserDto = {
                name: 'Test',
                email: 'test@gmail.com',
                password: '123456',
                age: 20,
                gender: 'Male',
                address: 'Hanoi',
                company: {
                    _id: new mongoose.Schema.Types.ObjectId('648717fac7573fac797f83fe'),
                    name: 'Lazada Việt Nam'
                },
                role: new mongoose.Types.ObjectId('671b04159fc04e766bcfa4e6') as unknown as ObjectId
            };
            await authController.register(registerUserDto);
            expect(authService.register).toHaveBeenCalledWith(registerUserDto);
        });
    });

    describe('refresh', () => {
        it('should call authService.processNewToken with correct parameters', async () => {
            const req = { cookies: { refresh_token: 'token' } } as any;
            const res = {} as Response;
            await authController.refresh(req, res);
            expect(authService.processNewToken).toHaveBeenCalledWith('token', res);
        });
    });

    describe('logout', () => {
        it('should call authService.logout with correct parameters', async () => {
            const res = {} as Response;
            const user: IUsers = {} as any;
            await authController.logout(res, user);
            expect(authService.logout).toHaveBeenCalledWith(user, res);
        });
    });
});