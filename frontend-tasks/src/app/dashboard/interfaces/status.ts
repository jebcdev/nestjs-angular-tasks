export interface Status {
    id?:          string;
    name:        string;
    description: string;
    color:       string;
    createdAt?:   Date;
    updatedAt?:   Date;
    deletedAt?:  Date| null;
}
