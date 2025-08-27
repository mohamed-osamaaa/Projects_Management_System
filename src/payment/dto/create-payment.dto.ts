import { IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    successUrl: string; // URL to redirect after success

    @IsString()
    cancelUrl: string; // URL to redirect after failure/cancel
}
