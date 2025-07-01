import { Knex } from "knex";
import { RepositoryInterface } from "./interface.js";
import { Result } from "#types/result_wrapper.js";
import { WarehouseTariff } from "#types/wb_entities.js"
import { TariffPeriod } from "#types/wb_entities.js";

export abstract class AbstractRepository implements RepositoryInterface {

    constructor(protected readonly db: Knex) {}

    abstract getCurrentPeriod(): Promise<Result<TariffPeriod>>
    abstract deleteCurrentPeriod(): Promise<Result<number[]>>
    abstract savePeriod(period: TariffPeriod): Promise<Result<number>>
    abstract getWarehousesByPeriodId(tpId: number): Promise<Result<WarehouseTariff[]>>
    abstract deleteWarehousesByPeriodId(tpId: number): Promise<Result<number[]>>
    abstract saveWarehouses(warehouseList: WarehouseTariff[]): Promise<Result<number[]>>


}