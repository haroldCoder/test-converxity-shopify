import type { ConvertionEntity } from "../entites";

export interface ConversionRepository {
  create(data: ConvertionEntity): Promise<ConvertionEntity>;
  findByOrderId(orderId: string): Promise<ConvertionEntity | null>;
}