import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUsers } from 'src/users/interface/users.interface';
import { Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let configService: ConfigService;
    let rolesService: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        isValidEmail: jest.fn(),
                        isValidPassword: jest.fn(),
                        updateUserRefreshToken: jest.fn(),
                        register: jest.fn(),
                        findUserByToken: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
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

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        rolesService = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('login', () => {
        it('should call usersService.updateUserRefreshToken and return access token', async () => {
            const user: IUsers = {
                _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
                email: 'test@gmail.com',
                name: 'Test',
                role: new mongoose.Types.ObjectId() as unknown as ObjectId,
                permissions: [],
            } as any;
            const response = {
                cookie: jest.fn(),
            } as unknown as Response;

            jest.spyOn(authService, 'createRefreshToken').mockReturnValue('refresh_token');
            jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');
            jest.spyOn(usersService, 'updateUserRefreshToken').mockResolvedValue(null);

            const result = await authService.login(user, response);

            expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(user._id, 'refresh_token');
            expect(response.cookie).toHaveBeenCalledWith('refresh_token', 'refresh_token', expect.any(Object));
            expect(result).toEqual({
                access_token: 'access_token',
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions,
                },
            });
        });
    });

    describe('register', () => {
        it('should call usersService.register and return new user data', async () => {
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

            const newUser = await usersService.register(registerUserDto);

            jest.spyOn(usersService, 'register').mockResolvedValue(newUser);

            const result = await authService.register(registerUserDto);

            expect(usersService.register).toHaveBeenCalledWith(registerUserDto);
            expect(result).toEqual({
                _id: newUser._id,
                createAt: newUser.createdAt,
            });
        });
    });

    describe('processNewToken', () => {
        it('should call usersService.findUserByToken and return new access token', async () => {
            const refresh_Token = 'refresh_token';
            const response = {
                cookie: jest.fn(),
            } as unknown as Response;

            const user = {
                _id: new mongoose.Types.ObjectId(),
                email: 'test@gmail.com',
                name: 'Test',
                role: new mongoose.Types.ObjectId() as unknown as ObjectId,
                permissions: [],
            } as any;

            jest.spyOn(jwtService, 'verify').mockReturnValue(null);
            jest.spyOn(usersService, 'findUserByToken').mockResolvedValue(user);
            jest.spyOn(authService, 'createRefreshToken').mockReturnValue('new_refresh_token');
            jest.spyOn(jwtService, 'sign').mockReturnValue('new_access_token');
            jest.spyOn(usersService, 'updateUserRefreshToken').mockResolvedValue(null);
            jest.spyOn(rolesService, 'findOne').mockResolvedValue(user.role);

            const result = await authService.processNewToken(refresh_Token, response);

            expect(usersService.findUserByToken).toHaveBeenCalledWith(refresh_Token);
            expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(user._id.toString(), 'new_refresh_token');
            expect(response.cookie).toHaveBeenCalledWith('refresh_token1', 'new_refresh_token', expect.any(Object));
            expect(result).toEqual({
                access_token: 'new_access_token',
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: [],
                },
            });
        });
    });

    describe('logout', () => {
        it('should call usersService.updateUserRefreshToken and clear cookie', async () => {
            const user: IUsers = {
                _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
            } as any;
            const response = {
                clearCookie: jest.fn(),
            } as unknown as Response;

            jest.spyOn(usersService, 'updateUserRefreshToken').mockResolvedValue(null);

            const result = await authService.logout(user, response);

            expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(user._id, '');
            expect(response.clearCookie).toHaveBeenCalledWith('refresh_token');
            expect(result).toBe('ok');
        });
    });
});