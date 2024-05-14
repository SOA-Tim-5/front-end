export interface EncounterInstanceResponseDto {
    UserId: number;
    Status: number;
    CompletionTime: Date;
}

export enum EncounterInstanceStatus {
    Active,
    Completed,
}
