import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateUsageChargeUseCase } from '../application/use-cases';
import {
    ShopifyBillingGateway,
    ShopifyGraphqlClient,
} from '@/common/infrastructure/gateways';

@Controller()
export class BillingConsumer {
    constructor(
        private readonly createUsageChargeUseCase: CreateUsageChargeUseCase
    ) { }

    @EventPattern('conversion.registered')
    async handleConversionRegistered(@Payload() data: any) {
        const { shopDomain, accessToken, subscriptionLineItemId, conversionId, orderId, appFee } = data;

        console.log(`[Billing Consumer] Received conversion.registered for order ${orderId}`);

        try {
            const graphqlClient = new ShopifyGraphqlClient(
                shopDomain,
                accessToken,
                { maxRetries: 3, baseDelayMs: 500 }
            );
            const billingGateway = new ShopifyBillingGateway(graphqlClient);

            await this.createUsageChargeUseCase.execute({
                shopDomain,
                subscriptionLineItemId,
                conversionId,
                amount: appFee,
                description: `Comisión 5% venta referida (Orden: ${orderId})`,
                gateway: billingGateway,
            });

            console.log(`[Billing Consumer] Usage charge of $${appFee} created for shop ${shopDomain}`);
        } catch (error) {
            console.error(`[Billing Consumer] Failed to process usage charge for shop ${shopDomain}:`, error);
        }
    }
}

