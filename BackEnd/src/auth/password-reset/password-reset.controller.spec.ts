import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { RequestResetDto } from './dto/request-reset.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('PasswordResetController', () => {
    let controller: PasswordResetController;
    let service: PasswordResetService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PasswordResetController],
            providers: [
                {
                    provide: PasswordResetService,
                    useValue: {
                        requestReset: jest.fn(),
                        verifyOtp: jest.fn(),
                        resetPassword: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PasswordResetController>(PasswordResetController);
        service = module.get<PasswordResetService>(PasswordResetService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('requestReset', () => {
        it('should call PasswordResetService.requestReset with correct email', async () => {
            const requestResetDto: RequestResetDto = { email: 'test@example.com' };
            await controller.requestReset(requestResetDto);
            expect(service.requestReset).toHaveBeenCalledWith('test@example.com');
        });
    });

    describe('verifyOtp', () => {
        it('should call PasswordResetService.verifyOtp with correct email and otp', async () => {
            const verifyOtpDto: VerifyOtpDto = { email: 'test@example.com', otp: '123456' };
            await controller.verifyOtp(verifyOtpDto);
            expect(service.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
        });
    });

    describe('resetPassword', () => {
        it('should call PasswordResetService.resetPassword with correct email, newPassword, and otp', async () => {
            const resetPasswordDto: ResetPasswordDto = {
                email: 'test@example.com',
                newPassword: 'newPassword123',
                otp: '123456',
            };
            await controller.resetPassword(resetPasswordDto);
            expect(service.resetPassword).toHaveBeenCalledWith('test@example.com', 'newPassword123', '123456');
        });
    });
});