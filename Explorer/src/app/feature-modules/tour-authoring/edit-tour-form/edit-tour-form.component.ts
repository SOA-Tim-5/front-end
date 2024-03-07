import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
} from "@angular/core";
import { AdministrationService } from "../../administration/administration.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Tour } from "../model/tour.model";
import { TourAuthoringService } from "../tour-authoring.service";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { NotifierService } from "angular-notifier";
import { xpError } from "src/app/shared/model/error.model";

@Component({
    selector: "xp-edit-tour-form",
    templateUrl: "./edit-tour-form.component.html",
    styleUrls: ["./edit-tour-form.component.css"],
})
export class EditTourFormComponent implements OnInit {
    @Output() toursUpdated = new EventEmitter<null>();

    separatorKeysCodes: number[] = [ENTER, COMMA];

    public tour: Tour = {
        Name: "",
        Description: "",
        Difficulty: parseInt("0"),
        Tags: [],
        Price: parseInt("0"),
    };

    editTourForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        difficulty: new FormControl("", [Validators.required]),
        tags: new FormControl([] as string[], [Validators.required]),
        price: new FormControl("", [Validators.required]),
    });

    faXmark = faXmark;

    constructor(
        private service: TourAuthoringService,
        public dialog: MatDialogRef<EditTourFormComponent>,
        private notifier: NotifierService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit() {
        // console.log(this.data);
        this.editTourForm.reset();
        const tourPatch = {
            name: this.data.name || null,
            description: this.data.description || null,
            difficulty: this.data.difficulty.toString() || null,
            tags: this.data.tags || null,
            price: this.data.price.toString() || null,
        };
        this.editTourForm.patchValue(tourPatch);
    }

    addTag(tag: string): void {
        const tagArray = this.editTourForm.get("tags");
        if (tagArray && tagArray.value) {
            const tags = tagArray.value;
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                tagArray.setValue(tags);
            }
        }
    }

    removeTag(index: number): void {
        const tagArray = this.editTourForm.get("tags");
        if (tagArray && tagArray.value) {
            const tags = tagArray.value;
            tags.splice(index, 1);
            tagArray.setValue(tags);
        }
    }
    submit(): void {
        const updatedData = this.editTourForm.value;
        // console.log(updatedData);
        const tour: Tour = {
            Id: this.data.id,
            Name: updatedData.name || "",
            Description: updatedData.description || "",
            Difficulty: parseInt(updatedData.difficulty || "0"),
            Tags: updatedData.tags ? updatedData.tags : [],
            Price: parseInt(updatedData.price || "0"),
            Durations: this.data.durations,
        };

        // console.log(this.data.id);
        if(!this.isValidForm()){
            this.notifier.notify("error", "Please enter valid data.");
            return;
        }
        this.service.updateTour(tour).subscribe({
            next: () => {
                this.data.name = tour.Name;
                this.data.description = tour.Description;
                this.data.difficulty = tour.Difficulty;
                this.data.tags = tour.Tags;
                this.data.price = tour.Price;
                this.toursUpdated.emit();
                this.onClose();
                this.notifier.notify("success", "Successfully updated tour!");
            },
            error: err => {
                this.notifier.notify("error", xpError.getErrorMessage(err));
            },
        });
    }
    onClose(): void {
        this.dialog.close();
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || "").trim();

        // Add our fruit
        if (value) {
            this.addTag(value);
        }

        // Clear the input value
        event.chipInput!.clear();
    }

    remove(tag: string): void {
        const index = this.editTourForm.get("tags")!.value!.indexOf(tag);

        if (index >= 0) {
            this.removeTag(index);
        }
    }
    isValidForm():boolean{
        return this.editTourForm.value.description!="" && this.editTourForm.value.name!="" && this.editTourForm.value.price!="" && this.editTourForm.value.difficulty!="" && parseInt(this.editTourForm.value.price!)>=0 && parseInt(this.editTourForm.value.difficulty!)>=1 && parseInt(this.editTourForm.value.difficulty!)<=5
     }
    
}
