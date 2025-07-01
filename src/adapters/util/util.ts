import { TariffPeriod, WarehouseTariff } from "#types/wb_entities.js";

export const mapWarehouseList = (warehouseList: Array<any>): WarehouseTariff[] => {
    const resultList: WarehouseTariff[] = new Array()
    
    warehouseList.map((val: any) => {
        resultList.push({
            boxDeliveryAndStorageExpr: val.boxDeliveryAndStorageExpr,
            boxDeliveryBase: val.boxDeliveryBase,
            boxDeliveryLiter: val.boxDeliveryLiter,
            boxStorageBase: val.boxStorageBase,
            boxStorageLiter: val.boxStorageLiter,
            warehouseName: val.warehouseName,
        })
    })

    return resultList
}

export const mapTariffPeriod = (apiData: any, warehouseList: WarehouseTariff[]): TariffPeriod => {
    return {
        dtNextBox: apiData.dtNextBox,
        dtTillMax: apiData.dtTillMax,
        warehouseList: warehouseList,
    }
}

export const getCurrentDate = (): string => {
    const currentDate = new Date()
    
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}