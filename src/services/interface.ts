import { Result } from "#types/result_wrapper.js"
import { TariffSavingResult } from "#types/wb_service.js"

export interface WBServiceInterface {
    saveBoxTariffs(): Promise<Result<TariffSavingResult>>
}

export interface GSheetsInterface {
    syncBoxTariffs(): Promise<Result<never>>
}

