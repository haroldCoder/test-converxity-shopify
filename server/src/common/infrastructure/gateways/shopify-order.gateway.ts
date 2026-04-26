import type { IShopifyGraphqlClient } from '../../domain/ports';

import { Injectable } from '@nestjs/common';

export interface OrderDetails {
    totalPrice: number;
    currencyCode: string;
}

@Injectable()
export class ShopifyOrderGateway {
    constructor(private readonly graphqlClient: IShopifyGraphqlClient) { }

    async getOrderDetails(orderId: string): Promise<OrderDetails> {
        const gid = orderId.startsWith('gid://')
            ? orderId
            : `gid://shopify/Order/${orderId}`;

        const query = `
      query getOrder($id: ID!) {
        order(id: $id) {
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    `;

        const response = await this.graphqlClient.request<{
            order: {
                totalPriceSet: {
                    shopMoney: {
                        amount: string;
                        currencyCode: string;
                    }
                }
            }
        }>(query, { id: gid });

        if (!response.order) {
            throw new Error(`Order ${orderId} not found in Shopify`);
        }

        const { amount, currencyCode } = response.order.totalPriceSet.shopMoney;

        return {
            totalPrice: parseFloat(amount),
            currencyCode,
        };
    }
}
