export interface Encounter {
    Id: number;
    Title: string;
    Description: string;
    Picture: string;
    Longitude: number;
    Latitude: number;
    Radius: number;
    XpReward: number;
    Status: EncounterStatus;
    Type: EncounterType;
    PeopleNumber?: number;
    PictureLongitude?: number;
    PictureLatitude?: number;
    ChallengeDone: boolean;
    Instances?: number[];
}

export enum EncounterType {
    Social,
    Hidden,
    Misc,
    KeyPoint,
}
export enum EncounterStatus {
    Active,
    Draft,
    Archieved,
}
