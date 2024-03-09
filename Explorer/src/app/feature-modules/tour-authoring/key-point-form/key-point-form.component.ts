import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { TourAuthoringService } from "../tour-authoring.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { environment } from "src/env/environment";
import { KeyPoint } from "../model/key-point.model";
import {
    PublicKeyPointRequest,
    PublicStatus,
} from "../model/public-key-point-request.model";

import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Person } from "../../stakeholder/model/person.model";
import { MapService } from "src/app/shared/map/map.service";
import { MatDialog } from "@angular/material/dialog";
import { KeyPointEncounterFormComponent } from "../../encounter/key-point-encounter-form/key-point-encounter-form.component";

@Component({
    selector: "xp-key-point-form",
    templateUrl: "./key-point-form.component.html",
    styleUrls: ["./key-point-form.component.css"],
})
export class KeyPointFormComponent implements OnChanges {
    @Output() keyPointUpdated = new EventEmitter<KeyPoint>();
    @Input() keyPoint: KeyPoint | null;
    @Input() longLat: [number, number];
    @Input() shouldEdit: boolean = false;
    tourImage: string | null = null;
    tourImageFile: File | null = null;
    hasEncounter: boolean = false;
    isEncounterRequired: boolean = false;
    person: Person;

    constructor(
        private route: ActivatedRoute,
        private service: TourAuthoringService,
        private authService: AuthService,
        private mapService: MapService,
        private dialogRef: MatDialog,
    ) {}
    ngOnInit(): void {
        this.getPerson();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["longLat"] && !changes["longLat"].isFirstChange()) {
            this.keyPointForm.patchValue({
                Longitude: this.longLat[0],
                Latitude: this.longLat[1],
            });
            return;
        }

        this.tourImage = null;
        this.tourImageFile = null;
        this.keyPointForm.reset();
        if (this.shouldEdit) {
            this.tourImage = environment.imageHost + this.keyPoint!.ImagePath;
            this.keyPointForm.patchValue(this.keyPoint!);
        }
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

    addKeyPoint(): void {
        if (this.isValidForm()) return;

        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                this.service.uploadImage(this.tourImageFile!).subscribe({
                    next: (imagePath: string) => {
                        const keyPoint: KeyPoint = {
                            TourId: +params.get("id")!,
                            Name: this.keyPointForm.value.Name || "",
                            Description:
                                this.keyPointForm.value.Description || "",
                            Longitude: this.keyPointForm.value.Longitude || 0,
                            Latitude: this.keyPointForm.value.Latitude || 0,
                            LocationAddress:
                                this.keyPointForm.value.Address || "",
                            ImagePath: imagePath,
                            Order: 0,
                            HaveSecret:
                                this.keyPointForm.value.HaveSecret || false,
                            Secret:
                                {
                                    images: [""],
                                    description:
                                        this.keyPointForm.value
                                            .SecretDescription || "",
                                } || null,
                            HasEncounter: this.hasEncounter,
                            IsEncounterRequired: this.isEncounterRequired,
                        };
                        // Get Key Points location address
                        this.mapService
                            .reverseSearch(
                                keyPoint.Latitude,
                                keyPoint.Longitude,
                            )
                            .subscribe(res => {
                                const addressInfo = {
                                    number: "",
                                    street: "",
                                    city: "",
                                    postalCode: "",
                                    country: "",
                                };

                                let addressParts = res.display_name.split(",");

                                this.setAddressInfo(addressInfo, addressParts);
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
                                        this.keyPointUpdated.emit(keyPoint);
                                        if (
                                            this.keyPointForm.value
                                                .IsPublicChecked
                                        ) {
                                            const request: PublicKeyPointRequest =
                                                {
                                                    KeyPointId:
                                                        result.Id as number,
                                                    Status: PublicStatus.Pending,
                                                    AuthorName:
                                                        this.person.name +
                                                        " " +
                                                        this.person.surname,
                                                };
                                            this.service
                                                .addPublicKeyPointRequest(
                                                    request,
                                                )
                                                .subscribe({});
                                        }
                                    },
                                });
                            });
                    },
                });
            },
        });
    }

    updateKeyPoint(): void {
        if (this.isValidForm()) return;

        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                let keyPoint: KeyPoint = {
                    Id: this.keyPoint!.Id,
                    TourId: +params.get("id")!,
                    Name: this.keyPointForm.value.Name || "",
                    Description: this.keyPointForm.value.Description || "",
                    Longitude: this.keyPointForm.value.Longitude || 0,
                    Latitude: this.keyPointForm.value.Latitude || 0,
                    LocationAddress: this.keyPointForm.value.Address || "",
                    ImagePath: this.keyPointForm.value.ImagePath || "",
                    Order: 0,
                    HaveSecret: this.keyPointForm.value.HaveSecret || false,
                    Secret:
                        {
                            images: [""],
                            description:
                                this.keyPointForm.value.SecretDescription || "",
                        } || null,
                    HasEncounter: this.hasEncounter,
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
                    });
                } else {
                    // Get Key Points location address
                    this.mapService
                        .reverseSearch(keyPoint.Latitude, keyPoint.Longitude)
                        .subscribe(res => {
                            const addressInfo = {
                                number: "",
                                street: "",
                                city: "",
                                postalCode: "",
                                country: "",
                            };

                            let addressParts = res.display_name.split(",");

                            this.setAddressInfo(addressInfo, addressParts);
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
                                next: () => {
                                    this.keyPointUpdated.emit();
                                },
                            });
                        });
                }
            },
        });
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

    setAddressInfo(addressInfo: any, addressParts: any): void {
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
    }

    getPerson(): void {
        this.authService.user$.subscribe(user => {
            this.service.getPerson(user.id).subscribe(result => {
                this.person = result;
            });
        });
    }

    addEncounter() {
        this.dialogRef.open(KeyPointEncounterFormComponent, {
            data: { keyPointId: this.keyPoint!.Id },
        });
    }
}
