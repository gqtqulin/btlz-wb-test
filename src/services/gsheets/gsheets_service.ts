import { getCurrentDate } from "#adapters/util/util.js";
import env from "#config/env/env.js";
import { err, ok, Result } from "#types/result_wrapper.js";
import { StockCoefficientsRow, TariffPeriod, WarehouseTariff } from "#types/wb_entities.js";
import { GSheetsAbstractService } from "./gsheets_abstract_service.js";
import { headers } from "./constants.js";

export class GSheetsService extends GSheetsAbstractService {
    
    async syncBoxTariffs(): Promise<Result<never>> {
        try {
            // Получаем текущий период из репозитория
            const currentPeriodResult: Result<TariffPeriod> = await this.db.getCurrentPeriod()
            if (!currentPeriodResult.success) {
                return err(currentPeriodResult.error)
            }

            if (!currentPeriodResult.data) {
                return err(new Error("no current period data"))
            }

            const period: TariffPeriod = currentPeriodResult.data
            if (!period.id) {
                return err(new Error("period id not found"))
            }

            const periodId: number = period.id

            // Получаем склады по periodId
            const warehousesResult = await this.db.getWarehousesByPeriodId(periodId)
            if (!warehousesResult.success) {
                return err(warehousesResult.error)
            }

            const warehouses = warehousesResult.data
            if (!warehouses) {
                return err(new Error(""))
            }

            // TODO: вынести в отдельный адаптер

            const rows: StockCoefficientsRow[] = warehouses.map(wh => ({
                insertDate: getCurrentDate(),
                warehouseName: wh.warehouseName,
                coefficient: wh.boxDeliveryAndStorageExpr,
                baseDeliveryCost: wh.boxDeliveryBase,
                deliveryCostPerLiter: wh.boxDeliveryLiter,
                baseStorageCost: wh.boxStorageBase,
                storageCostPerLiter: wh.boxStorageLiter
            }))

            const values = [
                headers,
                ...rows.map(row => [
                    row.insertDate,
                    row.warehouseName,
                    row.coefficient,
                    row.baseDeliveryCost,
                    row.deliveryCostPerLiter,
                    row.baseStorageCost,
                    row.storageCostPerLiter
                ])
            ]

            // Очищаем лист перед вставкой
            await this.sheets.spreadsheets.values.clear({
                spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
                range: 'stocks_coefs!A1:G'
            })

            // Вставляем новые данные
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
                range: 'stocks_coefs!A1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: values
                }
            })

            // Получаем ID листа
            const spreadsheet = await this.sheets.spreadsheets.get({
                spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID
            })

            const sheetId = spreadsheet.data.sheets?.find(
                sheet => sheet.properties?.title === 'stocks_coefs'
            )?.properties?.sheetId

            // тип ошибок для google
            if (!sheetId) {
                return err(new Error("Sheet 'stocks_coefs' not found"))
            }

            // Устанавливаем базовый фильтр и сортировку по колонке "Коэффицент"
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
                requestBody: {
                    requests: [
                        {
                            setBasicFilter: {
                                filter: {
                                    range: {
                                        sheetId: sheetId,
                                        startRowIndex: 0,
                                        endRowIndex: values.length,
                                        startColumnIndex: 0,
                                        endColumnIndex: 7
                                    }
                                }
                            }
                        },
                        {
                            sortRange: {
                                range: {
                                    sheetId: sheetId,
                                    startRowIndex: 1, // Начинаем с 1, чтобы не сортировать заголовки
                                    endRowIndex: values.length,
                                    startColumnIndex: 0,
                                    endColumnIndex: 7
                                },
                                sortSpecs: [
                                    {
                                        dimensionIndex: 2, // Индекс колонки "Коэффицент" (0-based)
                                        sortOrder: 'ASCENDING'
                                    }
                                ]
                            }
                        }
                    ]
                }
            })

            return ok(null)
        } catch (e) {
            console.error('Google Sheets error:', e);
            return err(e instanceof Error ? e : new Error("Unknown error during Google Sheets sync"))
        }
    }

}
