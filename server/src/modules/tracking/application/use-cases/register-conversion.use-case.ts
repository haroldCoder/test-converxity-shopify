import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PrismaTrackingRepository } from "../../infrastructure/repositories";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";
import { AffiliateNotFoundException } from "@/modules/affiliates/domain/exceptions";
import {
  ShopifyGraphqlClient,
  ShopifyOrderGateway,
} from "@/common/infrastructure/gateways";

@Injectable()
export class RegisterConversionUseCase {
  constructor(
    private readonly repo: PrismaTrackingRepository,
    private readonly shopRepo: PrismaShopRepository,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy
  ) { }

  async execute(input: {
    shopId: string;
    affiliateCode: string;
    orderId: string;
    total: number;
  }) {
    // Verificar si la tienda existe
    const shop = await this.shopRepo.findByDomain(
      input.shopId
    );
    if (!shop) {
      throw new ShopNotFoundException(input.shopId);
    }

    const exists = await this.repo.findByOrderId(
      shop.id,
      input.orderId
    );

    if (exists) {
      return exists;
    }

    const affiliate = await this.repo.findAffiliateByCode(
      shop.id,
      input.affiliateCode
    );

    if (!affiliate) {
      throw new AffiliateNotFoundException(
        input.affiliateCode
      );
    }

    // 1. Verificar datos de la orden via Shopify GraphQL
    let verifiedTotal = input.total;
    let currency = "USD";

    if (shop.accessToken) {
      try {
        const graphqlClient = new ShopifyGraphqlClient(
          shop.domain,
          shop.accessToken,
          { maxRetries: 3, baseDelayMs: 500 }
        );
        const orderGateway = new ShopifyOrderGateway(graphqlClient);
        const orderDetails = await orderGateway.getOrderDetails(input.orderId);

        verifiedTotal = orderDetails.totalPrice;
        currency = orderDetails.currencyCode;
      } catch (error) {
        console.error(`[Tracking] Failed to verify order ${input.orderId} via GraphQL:`, error);
      }
    }

    const appFee = verifiedTotal * 0.05;
    const affiliateFee =
      verifiedTotal * (affiliate.commissionPercent / 100);

    const conversion = await this.repo.createConversion({
      shopId: shop.id,
      affiliateId: affiliate.id,
      orderId: input.orderId,
      total: verifiedTotal,
      currency,
      appFee,
      affiliateFee,
    });

    // 2. evento asincrono a RabbitMQ
    if (shop.accessToken && shop.subscriptionLineItemId) {
      this.client.emit('conversion.registered', {
        shopDomain: shop.domain,
        accessToken: shop.accessToken,
        subscriptionLineItemId: shop.subscriptionLineItemId,
        conversionId: conversion.id,
        orderId: input.orderId,
        appFee: appFee,
      });
      console.log(`[Tracking] Event conversion.registered emitted for order ${input.orderId}`);
    } else {
      console.warn(
        `[Tracking] Event skipped for ${input.shopId}: missing subscription data or token.`
      );
    }

    return conversion;
  }
}