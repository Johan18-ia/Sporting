// src/data/sources/remote/models/ResponseApiDelivery.ts
export interface ResponseApiDelivery {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}