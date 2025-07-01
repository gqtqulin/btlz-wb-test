import { err, ok, Result } from "#types/result_wrapper.js";
import { TariffPeriod, WarehouseTariff } from "#types/wb_entities.js";
import { TariffSavingResult } from "#types/wb_service.js";
import { AbstractWBService } from "./wb_abstract_service.js";

export class WBService extends AbstractWBService {

    // http api handle + save in repo
    async saveBoxTariffs(): Promise<Result<TariffSavingResult>> {
        try {
            const httpResult = await this.adapter.getBoxTariffs()
            console.log(`success: ${httpResult.success}`)

            if (!httpResult.success) {
                return err(httpResult.error)
            }

            if (!httpResult.data) {
                return err(new Error("no data in http res"))
            }

            // Удаляем текущие тарифы (это автоматически удалит и связанные склады из-за CASCADE)
            const deleteResult = await this.db.deleteCurrentPeriod()
            if (!deleteResult.success) {
                return err(deleteResult.error)
            }

            const period: TariffPeriod = httpResult.data
            const warehouses: WarehouseTariff[] = period.warehouseList

            // save period
            const periodResult = await this.db.savePeriod(period)
            if (!periodResult.success) {
                return err(periodResult.error)
            }

            // save warehouses
            const periodId = periodResult.data
            const warehousesResult = await this.db.saveWarehouses(warehouses)

            if (!warehousesResult.success) {
                return err(warehousesResult.error)
            }
            
            if (!warehousesResult.data) {
                return err(new Error('no warehouses saving data'))
            }

            const data: TariffSavingResult = {
                createdTariffPeriodsIds: [Number(periodId)],
                createdWarehouseTariffsIds: warehousesResult.data.map(id => Number(id))
            }

            return ok(data)
        } catch (e) {
            return err(e instanceof Error ? e : new Error('Unknown error during saving tariffs'))
        }
    }

}