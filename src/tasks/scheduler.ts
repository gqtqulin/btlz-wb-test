import { WBService } from "#services/wb/wb_service.js";
import { CronJob } from "cron";
import knex from "#postgres/knex.js";
import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "#adapters/http_adapter.js";
import { PostgresRepository } from "#repositories/postgres_repository.js";
import { RepositoryInterface } from "#repositories/interface.js";
import { AdapterInterface } from "#adapters/interface.js";
import { GSheetsInterface, WBServiceInterface } from "#services/interface.js";
import { Knex } from "knex";
import { GSheetsService } from "#services/gsheets/gsheets_service.js";
import { google, sheets_v4 } from "googleapis";
import env from "#config/env/env.js";
import { getCronTiming } from "./util.js";

export const startScheduler = () => {
    console.log("🚀 Initializing scheduler...");

    const db: Knex = knex

    const httpClient: AxiosInstance = axios.create({
        baseURL: "https://common-api.wildberries.ru",
        timeout: 5000, 
        headers: {
            "Authorization": `Bearer ${process.env.WB_API_KEY}`,
        }
    })

    // убрать экранированные символы
    const privateKey = env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: privateKey,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });

    const repo: RepositoryInterface = new PostgresRepository(db)
    const adapter: AdapterInterface = new HttpAdapter(httpClient)
    const wbService: WBServiceInterface = new WBService(repo, adapter)
    const gService: GSheetsInterface = new GSheetsService(repo, sheets)
    // google sheets api adapter

    const run = async () => {
        console.log("🕒 Получаем данные о тарифах WB...");
        try {
            const wbRes = await wbService.saveBoxTariffs()

            if (!wbRes.success) {
                console.log(`❌ Ошибка при обновлении тарифов WB: "${wbRes.error}"`)
                return
            }

            console.log("✅ Тарифы успешно обновлены")

            console.log("🔄 Синхронизируем данные с Google Sheets...")
            const gsRes = await gService.syncBoxTariffs()
            
            if (!gsRes.success) {
                console.log(`❌ Ошибка при синхронизации с Google Sheets: "${gsRes.error}"`)
                return
            }

            console.log("✅ Синхронизация с Google Sheets завершена")

        } catch (e) {
            console.log(`❌ Ошибка при выполнении задачи: "${e}"`)
        }
    }

    // Запускаем задачу каждый час в 0 минут
    const cronTiming = getCronTiming()
    console.log(`cronTiming: ${cronTiming}`)
    new CronJob(cronTiming, async () => {
        console.log("⏰ Запуск по расписанию");
        await run();
    }).start();

    run()
    console.log("✅ Планировщик успешно запущен");
}