import { WarehouseTariffDB, WarehouseTariff, TariffPeriodDB, TariffPeriod } from "#types/wb_entities.js";

export const processRepositoryError = (err: any): Error => {
    if (err instanceof Error) {
        return err
    } else if (typeof(err) == "string") {
        return new Error(err)
    } else if (err && err.code) {
        return new Error(`db error: ${err.code}`)
    } else {
        return new Error("unknown error")
    }
}

export const mapDBTariffPeriodEntiry = (row: TariffPeriodDB, warehouseList: WarehouseTariff[]): TariffPeriod => {
    return {
        id: row.id,
        dtNextBox: row.dt_next_box,
        dtTillMax: row.dt_till_max,
        warehouseList: warehouseList,
    }
}

export const mapDBWarehouseEntity = (row: WarehouseTariffDB): WarehouseTariff => {
    return {
        id: row.id,
        warehouseName: row.warehouse_name,
        boxDeliveryAndStorageExpr: row.box_delivery_and_storage_expr,
        boxDeliveryBase: row.box_delivery_base,
        boxDeliveryLiter: row.box_delivery_liter,
        boxStorageBase: row.box_storage_base,
        boxStorageLiter: row.box_storage_liter
    }
}