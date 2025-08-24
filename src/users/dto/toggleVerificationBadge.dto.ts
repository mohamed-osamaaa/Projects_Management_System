import {
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class ToggleVerificationBadgeDto {
  @IsBoolean({ message: 'verificationBadge must be a boolean value' })
  @IsNotEmpty({ message: 'verificationBadge should not be empty' })
  verificationBadge: boolean;
}
