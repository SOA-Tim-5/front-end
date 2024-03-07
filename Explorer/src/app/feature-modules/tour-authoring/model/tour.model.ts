import { KeyPoint } from "./key-point.model";
import { TourDuration } from "./tourDuration.model";

export interface Tour {
    AuthorId?: number;
    Id?: number;
    Name: string;
    Description: string;
    Difficulty?: number;
    Tags?: string[];
    Status?: TourStatus;
    Price?: number;
    IsDeleted?: boolean;
    Distance?: number;
    PublishDate?: Date;
    Durations?: TourDuration[];
    KeyPoints?: KeyPoint[];
    AverageRating?: number;
    Recommended?: boolean;
    Active?: boolean;
    Category?: TourCategory;
}

export enum TourStatus {
    Draft = 0,
    Published = 1,
    Archived = 2,
    Ready = 3,
}
export enum TourCategory {
    Adventure = 0,
    FamilyTrips = 1,
    Cruise = 2,
    Cultural = 3,
    Undefined = 4,
}
