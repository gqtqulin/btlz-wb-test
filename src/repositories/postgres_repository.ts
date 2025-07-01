import { err, ok, Result } from "#types/result_wrapper.js";
import { WarehouseTariff, TariffPeriod, WarehouseTariffDB } from "#types/wb_entities.js";
import { AbstractRepository } from "./abstract_repository.js";
import { PERIOD_DB, WAREHOUSE_DB } from "./constants.js";
import { mapDBTariffPeriodEntiry, mapDBWarehouseEntity, processRepositoryError } from "./util/util.js";
import { getCurrentDate, mapTariffPeriod } from "#adapters/util/util.js";

// todo: вынести названия таблиц
export class PostgresRepository extends AbstractRepository {

    // получение из PERIOD_DB используя функцию getCurrentDate() из util.ts для текущей даты
    async getCurrentPeriod(): Promise<Result<TariffPeriod>> {
        try {
            const today = getCurrentDate()

            const periodRow = await this.db(PERIOD_DB)
            .whereRaw("DATE(created_at) = ?", [today])
            .first();

            if (!periodRow) {
                return ok(null);
            }

            const period: TariffPeriod = mapDBTariffPeriodEntiry(periodRow, [])

            return ok(period)
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }

    // удаление в PERIOD_DB используя функцию getCurrentDate() из util.ts для текущей даты
    async deleteCurrentPeriod(): Promise<Result<number[]>> {
        try {
            const today = getCurrentDate()

            const deleted = await this.db(PERIOD_DB)
                .whereRaw("DATE(created_at) = ?", [today])
                .delete()
                .returning("id")

            return ok(deleted.map(row => row.id))
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }

    // вставка в PERIOD_DB
    async savePeriod(period: TariffPeriod): Promise<Result<number>> {
        try {
            const inserted = await this.db(PERIOD_DB)
                .insert([
                    { 
                        dt_next_box: period.dtNextBox || null, 
                        dt_till_max: period.dtTillMax || null,
                        created_at: getCurrentDate()
                    },
                ])
                .returning("id")

            if (!inserted.length) {
                return err(new Error("db insert failed"))
            }

            const id = inserted[0].id

            return ok(id)
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }

    // получить запись из WAREHOUSE_DB по полю period_id (это ссылка на PERIOD_DB)
    async getWarehousesByPeriodId(tpId: number): Promise<Result<WarehouseTariff[]>> {
        try {
            const rows = await this.db
                .where({ period_id: tpId })
                .select<WarehouseTariffDB[]>()
                .from(WAREHOUSE_DB)

            const tariffs = rows.map(mapDBWarehouseEntity);

            return ok(tariffs)
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }

    // удалить все записи из WAREHOUSE_DB по полю period_id (это ссылка на PERIOD_DB)
    async deleteWarehousesByPeriodId(tpId: number): Promise<Result<number[]>> {
        try {
            const deleted = await this.db(WAREHOUSE_DB)
                .where({ period_id: tpId })
                .delete()
                .returning("id")

            return ok(deleted.map(row => row.id))
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }

    // сохранить все записи в WAREHOUSE_DB
    async saveWarehouses(warehouseList: WarehouseTariff[]): Promise<Result<number[]>> {
        try {
            // Получаем текущий период
            const today = getCurrentDate()
            const periodRow = await this.db(PERIOD_DB)
                .whereRaw("DATE(created_at) = ?", [today])
                .first();

            if (!periodRow || !periodRow.id) {
                return err(new Error("No current period found"))
            }

            // Преобразуем данные для вставки
            const dataToInsert = warehouseList.map(wh => ({
                warehouse_name: wh.warehouseName || null,
                box_delivery_and_storage_expr: wh.boxDeliveryAndStorageExpr || null,
                box_delivery_base: wh.boxDeliveryBase || null,
                box_delivery_liter: wh.boxDeliveryLiter || null,
                box_storage_base: wh.boxStorageBase || null,
                box_storage_liter: wh.boxStorageLiter || null,
                period_id: periodRow.id
            }))

            // Вставляем данные
            const inserted = await this.db(WAREHOUSE_DB)
                .insert(dataToInsert)
                .returning("id")

            return ok(inserted.map(row => row.id))
        } catch (e) {
            return err(processRepositoryError(e))
        }
    }
}