import { Result } from "#types/result_wrapper.js"
import { TariffPeriod, WarehouseTariff } from "#types/wb_entities.js"

interface TariffPeriodInterface {
    getCurrentPeriod(): Promise<Result<TariffPeriod>>
    deleteCurrentPeriod(): Promise<Result<number[]>>
    savePeriod(period: TariffPeriod): Promise<Result<number>>
}

interface WarehouseTariffInterface {
    getWarehousesByPeriodId(tpId: number): Promise<Result<WarehouseTariff[]>>
    deleteWarehousesByPeriodId(tpId: number): Promise<Result<number[]>>
    saveWarehouses(warehouseList: WarehouseTariff[]): Promise<Result<number[]>>
}

export interface RepositoryInterface extends TariffPeriodInterface, WarehouseTariffInterface { }