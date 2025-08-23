import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/utils/enums/userRoles.enum';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsIn(
    [
      UserRole.CLIENT,
      UserRole.COMPANY,
      UserRole.ENGINEER,
      UserRole.CUSTOMER_SERVICE,
    ],
    { message: 'Role must be one of: client, company, engineer, customer_service' },
  )
  role: UserRole;
}
