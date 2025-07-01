// todo: http
export type BoxTariffsHTTP = {
    response: {
        data: TariffPeriod,
    }
}

export type TariffPeriod = {
    id?: number;
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: WarehouseTariff[];
}

export type WarehouseTariff = {
    id?: number;
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
}

export type TariffPeriodDB = {
    id: number,
    dt_next_box: string,
    dt_till_max: string,
    created_at: string,
}

export type WarehouseTariffDB = {
    id: number;
    period_id: number;
    warehouse_name: string;
    box_delivery_and_storage_expr: string;
    box_delivery_base: string;
    box_delivery_liter: string;
    box_storage_base: string;
    box_storage_liter: string;
}

export type StockCoefficientsRow = {
    insertDate: string;
    warehouseName: string;
    coefficient: string;
    baseDeliveryCost: string;
    deliveryCostPerLiter: string;
    baseStorageCost: string;
    storageCostPerLiter: string;
}