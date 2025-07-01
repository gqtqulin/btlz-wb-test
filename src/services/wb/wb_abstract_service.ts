import { AdapterInterface } from "#adapters/interface.js";
import { RepositoryInterface } from "#repositories/interface.js";
import { WBServiceInterface } from "#services/interface.js";
import { Result } from "#types/result_wrapper.js";
import { TariffSavingResult } from "#types/wb_service.js";

export abstract class AbstractWBService implements WBServiceInterface {

    constructor(protected db: RepositoryInterface, protected adapter: AdapterInterface) {}
    
    abstract saveBoxTariffs(): Promise<Result<TariffSavingResult>>
}