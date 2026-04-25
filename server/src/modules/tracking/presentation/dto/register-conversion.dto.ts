import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class RegisterConversionDto {
    @IsString({ message: "shopId must be a string" })
    @IsNotEmpty({ message: "shopId is required" })
    shopId: string;

    @IsString({ message: "affiliateCode must be a string" })
    @IsNotEmpty({ message: "affiliateCode is required" })
    affiliateCode: string;

    @IsString({ message: "orderId must be a string" })
    @IsNotEmpty({ message: "orderId is required" })
    orderId: string;

    @IsNumber({}, { message: "total must be a number" })
    @IsPositive({ message: "total must be a positive number" })
    total: number;
}
