import knex, { migrate, seed } from "#postgres/knex.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

// https://common-api.wildberries.ru/api/v1/tariffs/box


/**
 * 
 * регулярное получение информации о тарифах wb и сохранение их в БД на каждый день;
 * 
 * регулярное обновление информации о актуальных тарифах в google-таблицах.
 * 
 * 
 */

