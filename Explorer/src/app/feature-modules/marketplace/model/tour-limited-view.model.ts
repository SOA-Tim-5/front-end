import { TourDuration } from "../../tour-authoring/model/tourDuration.model";
import { KeyPoint } from "../../tour-authoring/model/key-point.model";
import { Review } from "./review.model";

export interface TourLimitedView {
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
    KeyPoint?: KeyPoint;
    Reviews?: Review[];
    Discount?: number;
    DiscountedPrice?: number;
}

export enum TourStatus {
    Draft = 0,
    Published = 1,
    Archived = 2,
    Ready = 3,
}
