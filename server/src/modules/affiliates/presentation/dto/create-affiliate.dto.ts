import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAffiliateDto {
    @IsString({ message: "shopId must be a string" })
    @IsNotEmpty({ message: "shopId is required" })
    shopId: string;

    @IsString({ message: "name must be a string" })
    @IsNotEmpty({ message: "name is required" })
    name: string;

    @IsString({ message: "code must be a string" })
    @IsNotEmpty({ message: "code is required" })
    code: string;

    @IsNumber({}, { message: "commissionPercent must be a number" })
    @IsNotEmpty({ message: "commissionPercent is required" })
    commissionPercent: number;
}
