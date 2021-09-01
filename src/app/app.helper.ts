export interface ITable {
    properties: string[];
    records: any[];
}

export enum Clause {
    SELECT = 'select',
    FROM = 'from',
    WHERE = 'where',
    LIKE = 'like',
    LIMIT = 'limit',
    ORDERBY = 'order'
}