import { Axios, AxiosInstance } from "axios";
import { AbstractHttpAdapter } from "./abstract_http_adapter.js";
import { TariffPeriod, WarehouseTariff } from "#types/wb_entities.js";
import { err, ok, Result } from "#types/result_wrapper.js";
import { processWBAPIError, WBAPIError } from "#types/wb_service.js";
import { getCurrentDate, mapTariffPeriod, mapWarehouseList } from "./util/util.js";

export class HttpAdapter extends AbstractHttpAdapter {

    async getBoxTariffs(): Promise<Result<TariffPeriod>> {
        try {
            const url = `/api/v1/tariffs/box?date=${getCurrentDate()}`
            console.log(`getBoxTariffs url: ${url}`)

            const response = await this.client.get(url)
            //console.log(`getBoxTariffs response.data: ${JSON.stringify(response.data, null, 2)}`)

            const apiData = response.data?.response?.data;

            if (!apiData || !Array.isArray(apiData.warehouseList)) {
                return err(new WBAPIError("invalid JSON format", 500, response.data))
            }

            const warehouseList: WarehouseTariff[] = mapWarehouseList(apiData.warehouseList)
            const period: TariffPeriod = mapTariffPeriod(apiData, warehouseList)

            // console.log('warehouseList:', JSON.stringify(warehouseList, null, 2))
            // console.log('period:', JSON.stringify(period, null, 2))

            return ok(period)
        } catch (e) {
            return err(processWBAPIError(e))
        }
    }
}