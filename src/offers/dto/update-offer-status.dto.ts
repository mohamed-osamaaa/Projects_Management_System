import { IsEnum } from 'class-validator';
import { OfferStatus } from 'src/utils/enums/offerStatus.enum';

export class UpdateOfferStatusDto {
    @IsEnum(OfferStatus)
    status: OfferStatus;
}