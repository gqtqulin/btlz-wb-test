
export const ok = <T>(data: T): Result<T> => {
    return {
        success: true,
        data: data,
    }
}

export const err = (e: Error): Result<never> => {
    return {
        success: false,
        error: e,
    }
}

export type Result<T> =
    | { success: true; data: T | null }
    | { success: false; error: Error };