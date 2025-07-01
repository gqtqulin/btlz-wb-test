import { AxiosError } from "axios";

export type TariffSavingResult = {
    createdTariffPeriodsIds: Array<Number>;
    createdWarehouseTariffsIds: Array<Number>;
}


export const processWBAPIError = (e: any): WBAPIError => {

    // Если есть response - значит сервер ответил с ошибкой
    if (e?.response) {
        const { status, data } = e.response;

        if (status === 400) {
            return new WBAPIError("bad Request", status, data);
        }

        if (status === 401) {
            return new WBAPIError("unauthorized", status, data);
        }

        if (status === 429) {
            return new WBAPIError("too Many Requests", status, data);
        }

        return new WBAPIError("unknown response status", status, data);
    }

    // Если есть request, но нет response - значит сервер не ответил
    if (e?.request) {
        return new WBAPIError("no server response", 503, {});
    }

    // Если нет ни request, ни response - значит ошибка на этапе подготовки запроса
    if (e instanceof Error) {
        return new WBAPIError(`network or parsing error: ${e.message}`, 500, {});
    }

    return new WBAPIError("unknown error", 500, {
        raw: String(e),
    });
}

export class WBAPIError extends Error {
    public readonly code: number
    public readonly APIResponse: any

    constructor(
        message: string,
        code: number,
        APIResponse: any
    ) {
        super(message);
        this.code = code;
        this.APIResponse = APIResponse;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}