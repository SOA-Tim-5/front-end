import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { KeyPoint } from "../model/key-point.model";
import { TourAuthoringService } from "../tour-authoring.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { KeyPointEncounterFormComponent } from "../../encounter/key-point-encounter-form/key-point-encounter-form.component";
import { Tour } from "../model/tour.model";
import {
    PublicKeyPointRequest,
    PublicStatus,
} from "../model/public-key-point-request.model";
import { Person } from "../../stakeholder/model/person.model";
import { MapService } from "src/app/shared/map/map.service";
import { NotifierService } from "angular-notifier";
import { faImage, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { environment } from "src/env/environment";
import { MapModalComponent } from "src/app/shared/map-modal/map-modal.component";
import { LocationCoords } from "src/app/shared/model/location-coords.model";
import { xpError } from "src/app/shared/model/error.model";

export interface AddKeyPointModalData {
    keyPoint?: KeyPoint;
    isUpdateForm: Boolean;
    tour: Tour;
}

@Component({
    selector: "xp-key-point-modal",
    templateUrl: "./key-point-modal.component.html",
    styleUrls: ["./key-point-modal.component.css"],
})
export class KeyPointModalComponent implements OnInit {
    @Output() keyPointCreated = new EventEmitter<KeyPoint>();
    @Output() keyPointUpdated = new EventEmitter<KeyPoint>();
    keyPoint?: KeyPoint;
    isUpdateForm: Boolean = false;
    tour: Tour;
    tourImage: string | null = null;
    tourImageFile: File | null = null;
    hasEncounter: boolean = false;
    isEncounterRequired: boolean = false;
    person: Person;

    faImage = faImage;
    faLocation = faMapLocationDot;

    constructor(
        private service: TourAuthoringService,
        private authService: AuthService,
        private mapService: MapService,
        private notifier: NotifierService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<KeyPointModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddKeyPointModalData,
    ) {
        this.tour = data.tour;
        this.isUpdateForm = data.isUpdateForm;
        this.keyPoint = data.keyPoint;
        if (this.isUpdateForm) {
            this.tourImage = this.keyPoint!.ImagePath.startsWith("http")
                ? this.keyPoint!.ImagePath
                : environment.imageHost + this.keyPoint!.ImagePath;
            this.keyPointForm.patchValue(this.keyPoint!);
        }
    }

    ngOnInit(): void {
        this.getPerson();
    }

    keyPointForm = new FormGroup({
        Name: new FormControl("", [Validators.required]),
        Description: new FormControl("", [Validators.required]),
        Longitude: new FormControl<number>(null!, [Validators.required]),
        Latitude: new FormControl<number>(null!, [Validators.required]),
        Address: new FormControl<string>("", [Validators.required]),
        ImagePath: new FormControl<string>("", [Validators.required]),
        IsPublicChecked: new FormControl<boolean>(false),
        HaveSecret: new FormControl<boolean>(false),
        SecretDescription: new FormControl<string>(""),
        SecretImages: new FormControl<string>(""),
    });

    onSelectImage(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files[0]) {
            this.tourImageFile = element.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(this.tourImageFile);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.tourImage = reader.result as string;
                this.keyPointForm.value.ImagePath = "";
            };
        }
    }

    addEncounter() {
        this.dialog.open(KeyPointEncounterFormComponent, {
            data: { keyPointId: this.keyPoint!.Id },
        });
    }

    addKeyPoint(): void {
        if (this.isValidForm()) {
            this.notifier.notify("error", "Invalid keypoint data supplied.");
            return;
        }
        this.service.uploadImage(this.tourImageFile!).subscribe({
            next: (imagePath: string) => {
                const keyPoint: KeyPoint = {
                    TourId: this.tour.Id?.toString() || "",
                    Name: this.keyPointForm.value.Name || "",
                    Description: this.keyPointForm.value.Description || "",
                    Longitude: this.keyPointForm.value.Longitude || 0,
                    Latitude: this.keyPointForm.value.Latitude || 0,
                    LocationAddress: this.keyPointForm.value.Address || "",
                    ImagePath: imagePath,
                    Order: 0,
                    //HaveSecret:
                    //    this.keyPointForm.value.SecretDescription?.length != 0,
                    // Secret:
                    //     {
                    //         images: [""],
                    //         description:
                    //             this.keyPointForm.value.SecretDescription || "",
                    //     } || null,
                    //HasEncounter: this.hasEncounter,
                    IsEncounterRequired: this.isEncounterRequired,
                };
                // Get Key Points location address
                this.mapService
                    .reverseSearch(keyPoint.Latitude, keyPoint.Longitude)
                    .subscribe((res: { display_name: string }) => {
                        let addressInfo = {
                            number: "",
                            street: "",
                            city: "",
                            postalCode: "",
                            country: "",
                        };

                        let addressParts = res.display_name.split(",");

                        addressInfo = this.setAddressInfo(
                            addressInfo,
                            addressParts,
                        );
                        let concatenatedAddress =
                            addressInfo.number +
                            " " +
                            addressInfo.street +
                            " " +
                            addressInfo.city +
                            " " +
                            addressInfo.postalCode +
                            " " +
                            addressInfo.country;

                        keyPoint.LocationAddress = concatenatedAddress;

                        this.service.addKeyPoint(keyPoint).subscribe({
                            next: result => {
                                this.keyPointCreated.emit(result);
                                if (this.keyPointForm.value.IsPublicChecked) {
                                    const request: PublicKeyPointRequest = {
                                        KeyPointId: result.Id as number,
                                        Status: PublicStatus.Pending,
                                        AuthorName: "",
                                    };
                                    this.service
                                        .addPublicKeyPointRequest(request)
                                        .subscribe({});
                                }
                                this.dialogRef.close();
                                this.notifier.notify(
                                    "success",
                                    "Added a new keypoint!",
                                );
                            },
                            error: err => {
                                this.notifier.notify(
                                    "error",
                                    xpError.getErrorMessage(err),
                                );
                            },
                        });
                    });
            },
            error: err => {
                this.notifier.notify("error", "Invalid keypoint image.");
            },
        });
    }

    updateKeyPoint(): void {
        if (this.isValidForm()) {
            this.notifier.notify("error", "Invalid keypoint data supplied.");

            return;
        }
        let keyPoint: KeyPoint = {
            Id: this.keyPoint!.Id,
            TourId: this.tour.Id!.toString(),
            Name: this.keyPointForm.value.Name || "",
            Description: this.keyPointForm.value.Description || "",
            Longitude: this.keyPointForm.value.Longitude || 0,
            Latitude: this.keyPointForm.value.Latitude || 0,
            LocationAddress: this.keyPointForm.value.Address || "",
            ImagePath: this.keyPointForm.value.ImagePath || "",
            Order: this.keyPoint!.Order,
            //HaveSecret: this.keyPointForm.value.SecretDescription?.length != 0,
            // Secret:
            //     this.keyPointForm.value.SecretDescription?.length != 0
            //         ? {
            //               images: [""],
            //               description:
            //                   this.keyPointForm.value.SecretDescription || "",
            //           } || null
            //         : null,
            //HasEncounter: this.hasEncounter,
            IsEncounterRequired: this.isEncounterRequired,
        };

        if (!keyPoint.ImagePath) {
            this.service.uploadImage(this.tourImageFile!).subscribe({
                next: (imagePath: string) => {
                    keyPoint.ImagePath = imagePath;
                    this.service.updateKeyPoint(keyPoint).subscribe({
                        next: () => {
                            this.keyPointUpdated.emit();
                        },
                    });
                },
                error: err => {
                    this.notifier.notify("error", "Invalid keypoint image.");
                },
            });
        } else {
            // Get Key Points location address
            this.mapService
                .reverseSearch(keyPoint.Latitude, keyPoint.Longitude)
                .subscribe(res => {
                    let addressInfo = {
                        number: "",
                        street: "",
                        city: "",
                        postalCode: "",
                        country: "",
                    };

                    let addressParts = res.display_name.split(",");

                    addressInfo = this.setAddressInfo(
                        addressInfo,
                        addressParts,
                    );
                    let concatenatedAddress =
                        addressInfo.number +
                        " " +
                        addressInfo.street +
                        " " +
                        addressInfo.city +
                        " " +
                        addressInfo.postalCode +
                        " " +
                        addressInfo.country;

                    keyPoint.LocationAddress = concatenatedAddress;

                    this.service.updateKeyPoint(keyPoint).subscribe({
                        next: response => {
                            this.keyPointUpdated.emit(response);
                            this.dialogRef.close();
                            this.notifier.notify(
                                "success",
                                "Updated keypoint!",
                            );
                        },
                        error: err => {
                            this.notifier.notify(
                                "error",
                                xpError.getErrorMessage(err),
                            );
                        },
                    });
                });
        }
    }

    isValidForm(): boolean {
        if (
            this.keyPointForm.errors ||
            !this.keyPointForm.value.Latitude ||
            !this.keyPointForm.value.Longitude
        ) {
            return true;
        }

        return false;
    }

    getPerson(): void {
        this.authService.user$.subscribe(user => {
            this.service.getPerson(user.id).subscribe(result => {
                this.person = result;
            });
        });
    }

    setAddressInfo(addressInfo: any, addressParts: any): any {
        if (addressParts.length == 10) {
            addressInfo.number = addressParts[0];
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[4];
            addressInfo.postalCode = addressParts[8];
            addressInfo.country = addressParts[9];
        } else if (addressParts.length == 9) {
            addressInfo.number = addressParts[0];
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[3];
            addressInfo.postalCode = addressParts[7];
            addressInfo.country = addressParts[8];
        } else if (addressParts.length == 8) {
            addressInfo.number = "";
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[2];
            addressInfo.postalCode = addressParts[6];
            addressInfo.country = addressParts[7];
        } else if (addressParts.length == 7) {
            addressInfo.number = "";
            addressInfo.street = addressParts[0];
            addressInfo.city = addressParts[1];
            addressInfo.postalCode = addressParts[5];
            addressInfo.country = addressParts[6];
        }
        return addressInfo;
    }

    selectLocation() {
        const dialogRef = this.dialog.open(MapModalComponent, {
            data: {
                closeOnClick: true,
            },
        });
        dialogRef.componentInstance.positionChanged.subscribe(
            (result: LocationCoords) => {
                this.keyPointForm.controls["Longitude"].setValue(
                    result.longitude,
                );
                this.keyPointForm.controls["Latitude"].setValue(
                    result.latitude,
                );
                this.notifier.notify(
                    "info",
                    "Successfuly set keypoint location.",
                );
            },
        );
    }
}
