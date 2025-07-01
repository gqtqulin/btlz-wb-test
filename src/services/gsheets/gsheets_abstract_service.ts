import { RepositoryInterface } from "#repositories/interface.js";
import { GSheetsInterface } from "#services/interface.js";
import { Result } from "#types/result_wrapper.js";
import { sheets_v4 } from "googleapis";

export abstract class GSheetsAbstractService implements GSheetsInterface {
    constructor(protected db: RepositoryInterface, protected sheets: sheets_v4.Sheets) {}

    abstract syncBoxTariffs(): Promise<Result<never>>
}