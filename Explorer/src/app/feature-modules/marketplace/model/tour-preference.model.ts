export interface TourPreference {
    Id?: number;
    UserId?: number;
    DifficultyLevel: number;
    WalkingRating: number;
    CyclingRating: number;
    CarRating: number;
    BoatRating: number;
    SelectedTags: Array<string>;
}
