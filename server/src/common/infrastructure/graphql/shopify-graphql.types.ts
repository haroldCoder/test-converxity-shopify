/**
 * Tipos GraphQL internos de Shopify — compartidos entre el parser y el cliente.
 * No forman parte del dominio; son detalles de infraestructura.
 */

export interface ThrottleStatus {
    maximumAvailable: number;
    currentlyAvailable: number;
    restoreRate: number;
}

export interface CostExtension {
    requestedQueryCost: number;
    actualQueryCost: number | null;
    throttleStatus: ThrottleStatus;
}

export interface GraphqlErrorExtensions {
    code?: string;
    cost?: CostExtension;
}

export interface GraphqlError {
    message: string;
    extensions?: GraphqlErrorExtensions;
}

export interface GraphqlResponse<T> {
    data?: T;
    errors?: GraphqlError[];
    extensions?: {
        cost?: CostExtension;
    };
}
