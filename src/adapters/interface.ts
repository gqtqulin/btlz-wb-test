import { Result } from "#types/result_wrapper.js"
import { TariffPeriod } from "#types/wb_entities.js"

export type AdapterInterface = {
    getBoxTariffs(): Promise<Result<TariffPeriod>>
}