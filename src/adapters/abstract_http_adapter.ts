import { AxiosInstance } from "axios";
import { AdapterInterface } from "./interface.js";
import { TariffPeriod } from "#types/wb_entities.js";
import { Result } from "#types/result_wrapper.js";

export abstract class AbstractHttpAdapter implements AdapterInterface {
    
    constructor(protected client: AxiosInstance) {}

    abstract getBoxTariffs(): Promise<Result<TariffPeriod>>
}