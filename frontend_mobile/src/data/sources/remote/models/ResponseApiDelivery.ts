// Encargado: Modelo - ResponseApiDelivery
// Descripción: Tipado de respuesta unificado desde ApiDelivery
// Archivo: src/data/sources/remote/models/ResponseApiDelivery.ts
// ============================================
// src/data/sources/remote/models/ResponseApiDelivery.ts
export interface ResponseApiDelivery {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}