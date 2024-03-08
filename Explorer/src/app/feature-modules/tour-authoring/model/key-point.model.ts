import { KeyPointSecret } from "./key-point-secret.model";

export interface KeyPoint {
    Id?: number;
    TourId: number;
    Name: string;
    Description: string;
    Longitude: number;
    Latitude: number;
    LocationAddress?: string;
    ImagePath: string;
    Order: number;
    HaveSecret: boolean;
    Secret: KeyPointSecret | null;
    HasEncounter: boolean;
    IsEncounterRequired: boolean;
}
