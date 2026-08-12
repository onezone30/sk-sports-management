/** Shape of a Laravel paginate() response wrapped in an API Resource collection. */
export interface Paginated<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
