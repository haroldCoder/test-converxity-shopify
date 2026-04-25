import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateUsageChargeDto {
    @IsString({ message: "shopDomain must be a string" })
    @IsNotEmpty({ message: "shopDomain is required" })
    shopDomain: string;

    @IsString({ message: "accessToken must be a string" })
    @IsNotEmpty({ message: "accessToken is required" })
    accessToken: string;

    @IsString({ message: "subscriptionLineItemId must be a string" })
    @IsNotEmpty({ message: "subscriptionLineItemId is required" })
    subscriptionLineItemId: string;

    @IsString({ message: "conversionId must be a string" })
    @IsNotEmpty({ message: "conversionId is required" })
    conversionId: string;

    @IsNumber({}, { message: "amount must be a number" })
    @IsPositive({ message: "amount must be a monetary value" })
    amount: number;
}
