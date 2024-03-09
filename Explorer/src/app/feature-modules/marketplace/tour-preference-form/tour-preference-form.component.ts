import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MarketplaceService } from "../marketplace.service";
import { TourPreference } from "../model/tour-preference.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { InputTags } from "../model/input-tags.model";

@Component({
    selector: "xp-tour-preference-form",
    templateUrl: "./tour-preference-form.component.html",
    styleUrls: ["./tour-preference-form.component.css"],
})
export class TourPreferenceFormComponent {
    constructor(
        private service: MarketplaceService,
        private snackBar: MatSnackBar,
        private router: Router,
    ) {}

    Tags: Array<InputTags> = [];
    @Input() preference: TourPreference;
    @Input() shouldEdit: boolean = false;
    @Output() shouldEditChange = new EventEmitter<boolean>();
    @Output() preferenceUpdated = new EventEmitter<null>();

    tourPreferenceForm = new FormGroup({
        difficultyLevel: new FormControl(null, [Validators.required]),
        walkingRating: new FormControl(null, [Validators.required]),
        cyclingRating: new FormControl(null, [Validators.required]),
        carRating: new FormControl(null, [Validators.required]),
        boatRating: new FormControl(null, [Validators.required]),
    });

    addPreference(): void {
        let tagsList = [];
        for (let t of this.Tags) {
            tagsList.push(t.name);
        }

        const tourPreference: TourPreference = {
            DifficultyLevel: this.tourPreferenceForm.value.difficultyLevel || 1,
            WalkingRating: this.tourPreferenceForm.value.walkingRating || 0,
            CyclingRating: this.tourPreferenceForm.value.cyclingRating || 0,
            CarRating: this.tourPreferenceForm.value.carRating || 0,
            BoatRating: this.tourPreferenceForm.value.boatRating || 0,
            SelectedTags: tagsList,
        };

        if (!this.IsDataValid(tourPreference)) {
            this.snackBar.open("Data not valid!", "Close", {
                duration: 5000,
            });
        } else {
            this.service.addPreference(tourPreference).subscribe({
                next: _ => {
                    this.preferenceUpdated.emit();
                    this.snackBar.open("Successfully created!", "Close", {
                        duration: 2000,
                    });
                    this.router.navigate(["/tour-preference"]);
                },
                error: _ => {
                    this.snackBar.open("Failed to create!", "Close", {
                        duration: 2000,
                    });
                },
            });
        }
    }

    updatePreference(): void {
        let tagsList = [];
        for (let t of this.Tags) {
            tagsList.push(t.name);
        }

        const tourPreference: TourPreference = {
            Id: this.preference.Id,
            UserId: this.preference.UserId,
            DifficultyLevel: this.tourPreferenceForm.value.difficultyLevel || 1,
            WalkingRating: this.tourPreferenceForm.value.walkingRating || 0,
            CyclingRating: this.tourPreferenceForm.value.cyclingRating || 0,
            CarRating: this.tourPreferenceForm.value.carRating || 0,
            BoatRating: this.tourPreferenceForm.value.boatRating || 0,
            SelectedTags: tagsList,
        };
        if (this.IsDataValid(tourPreference)) {
            this.snackBar.open("Data not valid!", "Close", {
                duration: 5000,
            });
        } else {
            this.service.updatePreference(tourPreference).subscribe({
                next: (result: TourPreference) => {
                    this.preference = result;
                    this.preferenceUpdated.emit();
                    this.snackBar.open("Successfully updated!", "Close", {
                        duration: 2000,
                    });
                    this.shouldEdit = false;
                    this.shouldEditChange.emit(false);
                    this.router.navigate(["/tour-preference"]);
                },
                error: _ => {
                    this.snackBar.open("Failed to update!", "Close", {
                        duration: 2000,
                    });
                },
            });
        }
    }

    IsDataValid(tourPreference: TourPreference): boolean {
        console.log(tourPreference);
        return (
            tourPreference.DifficultyLevel >= 1 &&
            tourPreference.DifficultyLevel <= 5 &&
            tourPreference.DifficultyLevel != null &&
            tourPreference.WalkingRating >= 0 &&
            tourPreference.WalkingRating <= 3 &&
            tourPreference.WalkingRating != null &&
            tourPreference.CyclingRating >= 0 &&
            tourPreference.CyclingRating <= 3 &&
            tourPreference.CyclingRating != null &&
            tourPreference.CarRating >= 0 &&
            tourPreference.CarRating <= 3 &&
            tourPreference.CarRating != null &&
            tourPreference.BoatRating >= 0 &&
            tourPreference.BoatRating <= 3 &&
            tourPreference.BoatRating != null &&
            tourPreference.SelectedTags.length > 0
        );
    }
}
