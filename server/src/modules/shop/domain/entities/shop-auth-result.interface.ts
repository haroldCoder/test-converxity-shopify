import { ShopEntity } from "./shop.entity";

export interface ShopAuthResult extends Partial<ShopEntity> {
    confirmationUrl?: string;
}
