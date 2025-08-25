import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    paymentAccountId: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    userPassword: string;
}
