import env from "#config/env/env.js"

const BY_MIN = "* * * * *"
const BY_HOUR = "0 * * * *"

export const getCronTiming = (): string => {
    let result: string = BY_HOUR // by hour default

    if (env.NODE_ENV == "production") {
        result = BY_HOUR
    } else if (env.NODE_ENV == "development") {
        result = BY_MIN
    }

    return result

}