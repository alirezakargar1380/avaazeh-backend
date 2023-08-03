import { IPagination } from "../types/pagination.type"

export const getPagination = (page: number, perPage: number): IPagination => {
    return {
        take: perPage,
        skip: (perPage * page) - perPage
    }
}