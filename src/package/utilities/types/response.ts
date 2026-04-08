

export interface ResponseData<T> {
    data: {
        success: boolean,
        data: T
    }
}