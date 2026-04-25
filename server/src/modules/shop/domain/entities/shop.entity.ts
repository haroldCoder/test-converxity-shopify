export interface ShopEntity {
    id: string;
    domain: string;
    accessToken: string;
    subscriptionId?: string | null;
    subscriptionLineItemId?: string | null;
    installedAt?: Date;
    updatedAt?: Date;
}
