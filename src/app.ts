import knex, { migrate, seed } from "#postgres/knex.js";
import { startScheduler } from "#tasks/scheduler.js";


const runMigrations = async () => {
    await migrate.latest();
    // await seed.run();
}

const main = async () => {
    await runMigrations()
    startScheduler()
}

main().catch(err => {
    console.log(`An error occurred while running the application: ${err}`)
    process.exit(1)
})