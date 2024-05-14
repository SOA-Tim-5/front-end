import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { EncounterService } from "../encounter.service";
import { Encounter, EncounterType } from "../model/encounter.model";
import { MapComponent } from "src/app/shared/map/map.component";
import { UserPositionWithRange } from "../model/user-position-with-range.model";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PositionSimulatorComponent } from "src/app/shared/position-simulator/position-simulator.component";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { EncounterInstanceResponseDto } from "../model/encounter-instance.model";
import { NotifierService } from "angular-notifier";
import { xpError } from "src/app/shared/model/error.model";
import { environment } from "src/env/environment";
import { EncounterCompletedPopupComponent } from "../encounter-completed-popup/encounter-completed-popup.component";
import { ListEncounterResponseDto } from "../model/ListEncounterResponseDto.model";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";

@Component({
    selector: "xp-active-encounter-view",
    templateUrl: "./active-encounter-view.component.html",
    styleUrls: ["./active-encounter-view.component.css"],
})
export class ActiveEncounterViewComponent implements AfterViewInit {
    points: any;
    encounters: Encounter[];
    
    filteredEncounters:Encounter[]
    allEncounter: ListEncounterResponseDto;
    encounter?: Encounter;
    encounterInstance?: EncounterInstanceResponseDto;
    loadEncounterInstance?: EncounterInstanceResponseDto;
    dialogRef: MatDialogRef<PositionSimulatorComponent, any> | undefined;
    matDialogRef:
        | MatDialogRef<EncounterCompletedPopupComponent, any>
        | undefined;
    hiddenEncounterCheck: boolean = false;
    encounterNumber: number = 0

    private readonly notifier: NotifierService;

    @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;

    faLocation = faLocationCrosshairs;

    userPosition: UserPositionWithRange = {
        range: 7000000,
        longitude: 19,
        latitude: 45,
    };

    constructor(
        private service: EncounterService,
        private authService: AuthService,
        notifierService: NotifierService,
        public dialog: MatDialog,
        private authoringService:TourAuthoringService
    ) {
        this.notifier = notifierService;
    }

    ngAfterViewInit(): void {
        this.authService.userLocation$.subscribe({
            next: location => {
                this.encounter = undefined;
                this.userPosition.latitude = location.latitude;
                this.userPosition.longitude = location.longitude;
                if (this.mapComponent) {
                    this.mapComponent.setUserPositionMarker(
                        this.userPosition.latitude,
                        this.userPosition.longitude,
                    );
                }
                this.loadEncountersInRangeOfFromCurrentLocation(
                    this.userPosition,
                );
            },
        });
    }

    getEncounterInstance(encounterId: number) {


        this.service
            .getEncounterInstance(encounterId)
            .subscribe(result => {this.encounterInstance = result;
            });

    }

    activateEncounter() {
       // if(this.encounterInstance?.userId == 0){
            this.service
            .activateEncounter(this.userPosition, this.encounter!.Id)
            .subscribe({
                next: (result) => {
                    if(result != null)
                    {
                        this.notifier.notify(
                            "info",
                            "Successfully activated encounter!",
                            );
                            this.getEncounterInstance(this.encounter!.Id);
                            if (this.encounter!.Type === 1) {
                                this.hiddenEncounterCheck = true;
                                this.handleHiddenLocationCompletion();
                            }
                    }else{
                        this.notifier.notify("error", "Not in range or already activated");
                    }
                    },
                    error: err => {
                        this.notifier.notify("error", xpError.getErrorMessage(err));
                    },
                });
         /*   }else if(this.encounterInstance?.status == 0){
                this.notifier.notify(
                    "info",
                    "Already activated encounter!",
                    );
                    this.getEncounterInstance(this.encounter!.Id);
                    if (this.encounter!.Type === 1) {
                        this.hiddenEncounterCheck = true;
                        this.handleHiddenLocationCompletion();
                    }
            }else{
                this.notifier.notify(
                    "info",
                    "Already completed encounter!",
                    );
            }*/
            }
            
            handleHiddenLocationCompletion() {
                let counter = 0;
                const currentEncounterId = this.encounter?.Id;
                console.log("Testing hidden location...");
                const interval = setInterval(() => {
                    if (!this.encounter) {
                        clearInterval(interval);
                        return;
                    }
                            this.service
                            .checkIfUserInCompletionRange(
                                this.userPosition,
                                this.encounter!.Id,
                                )
                        .subscribe({
                            next: result => {
                                this.hiddenEncounterCheck = result;
                                if (this.hiddenEncounterCheck == false) {
                                    clearInterval(interval);
                                    return;
                                }
                                counter++;
                                if (counter >= 4) {
                                    if (
                                        this.hiddenEncounterCheck &&
                                        currentEncounterId == this.encounter?.Id &&
                                        this.encounterInstance?.Status == 0
                                    ) {
                                        console.log("Test passed, completing...");
                                        this.completeEncounter();
                                    }
                                    clearInterval(interval);
                                }
                            },
                        });
        }, 2000);
    }

    completeEncounter() {
        if (this.encounter!.Type === 1) {
            this.service
                .completeHiddenLocationEncounter(
                    this.userPosition,
                    this.encounter!.Id,
                )
                .subscribe({
                    next: () => {
                        this.notifier.notify(
                            "success",
                            "Successfully completed hidden encounter!",
                        );
                        this.authService.updateXp();
                        this.getEncounterInstance(this.encounter!.Id);
                        this.matDialogRef = this.dialog.open(
                            EncounterCompletedPopupComponent,
                        );
                        this.completeEncounterOnMap();
                    },
                    error: err => {
                        // console.log(err);
                        this.notifier.notify(
                            "error",
                            xpError.getErrorMessage(err),
                        );
                    },
                });
        } else if(this.encounter!.Type === 2){
            console.log("TTTTTT")
            console.log(this.encounter)

            console.log(this.encounter!.Id)
            this.service
                .completeEncounter(this.userPosition, this.encounter!.Id)
                .subscribe({
                    next: () => {
                        this.notifier.notify(
                            "success",
                            "Successfully completed " +
                                EncounterType[this.encounter!.Type] +
                                " encounter!",
                        );
                        this.completeEncounterOnMap();
                        this.authService.updateXp();
                        this.getEncounterInstance(this.encounter!.Id);
                        this.matDialogRef = this.dialog.open(
                            EncounterCompletedPopupComponent,
                        );
                    },
                    error: err => {
                        // console.log(err);
                        this.notifier.notify(
                            "error",
                            xpError.getErrorMessage(err),
                        );
                    },
                });

/*
                    this.service
                        .completeSocialEncounter(this.userPosition, this.encounter!.Id)
                        .subscribe({
                            next: (result) => {
                                if(!result)
                                {
                                    this.notifier.notify(
                                        "success",
                                        "Not enough people or server error" +
                                            EncounterType[this.encounter!.Type] +
                                            " encounter!",
                                    );
                                    return;
                                }
                                this.notifier.notify(
                                    "success",
                                    "Successfully completed " +
                                        EncounterType[this.encounter!.Type] +
                                        " encounter!",
                                );
                                this.completeEncounterOnMap();
                                this.authService.updateXp();
                                this.getEncounterInstance(this.encounter!.Id);
                                this.matDialogRef = this.dialog.open(
                                    EncounterCompletedPopupComponent,
                                );
                            },
                            error: err => {
                                // console.log(err);
                                this.notifier.notify(
                                    "error",
                                    xpError.getErrorMessage(err),
                                );
                            },
            });*/
        }else {
            this.service
            .completeSocialEncounter(this.userPosition, this.encounter!.Id)
            .subscribe({
                next: (result) => {
                    if(!result)
                    {
                        this.notifier.notify(
                            "success",
                            "Not enough people or server error" +
                                EncounterType[this.encounter!.Type] +
                                " encounter!",
                        );
                        return;
                    }
                    this.notifier.notify(
                        "success",
                        "Successfully completed " +
                            EncounterType[this.encounter!.Type] +
                            " encounter!",
                    );
                    this.completeEncounterOnMap();
                    this.authService.updateXp();
                    this.getEncounterInstance(this.encounter!.Id);
                    this.matDialogRef = this.dialog.open(
                        EncounterCompletedPopupComponent,
                    );
                },
                error: err => {
                    // console.log(err);
                    this.notifier.notify(
                        "error",
                        xpError.getErrorMessage(err),
                    );
                },
});
        }
    }

    checkIfUserInEncounterRange(encounter: Encounter): boolean {
        const userLat = this.userPosition.latitude;
        const userLng = this.userPosition.longitude;
        const encounterLat = encounter.Latitude;
        const encounterLng = encounter.Longitude;
        const earthRadius = 6371;
        const toRadians = (value: number) => (value * Math.PI) / 180;
        const haversine = (a: number, b: number) =>
            Math.pow(Math.sin((b - a) / 2), 2);

        const distance =
            2 *
            earthRadius *
            Math.asin(
                Math.sqrt(
                    haversine(toRadians(userLat), toRadians(encounterLat)) +
                        Math.cos(toRadians(userLat)) *
                            Math.cos(toRadians(encounterLat)) *
                            haversine(
                                toRadians(userLng),
                                toRadians(encounterLng),
                            ),
                ),
            );
        // console.log(distance * 1000);
        return distance * 1000 <= encounter.Radius;
    }

    loadEncountersInRangeOfFromCurrentLocation(
        userPosition: UserPositionWithRange,
    ) {
        this.service.getEncountersInRangeOf(userPosition).subscribe(result => {
            this.allEncounter = result;
            this.filteredEncounters=this.allEncounter.encounters;
            this.filteredEncounters.forEach((enc, i) => {
                this.filteredEncounters[i].Picture = enc.Picture.startsWith(
                    "http",
                )
                    ? enc.Picture
                    : environment.imageHost + enc.Picture;                
                });
            });
            this.encounter = this.filteredEncounters.at(this.encounterNumber)
            this.service.getEncounterInstance(this.encounter?.Id || 0).subscribe(result => {

                this.encounterInstance = result;
            })
            if (this.filteredEncounters) {
                this.filteredEncounters.forEach(enc => {
                    if (this.checkIfUserInEncounterRange(enc)) {
                        this.encounter = enc;
                        this.getEncounterInstance(enc.Id);
                        if (this.encounter.Type === 1) {
                            if (this.encounterInstance) {
                                if (this.encounterInstance.Status == 0) {
                                    this.hiddenEncounterCheck = true;
                                    this.handleHiddenLocationCompletion();
                                }
                            }
                        }
                    }
                });
            }
    }


    openSimulator() {
        if (this.dialogRef) {
            this.dialogRef.close();
            return;
        }
        this.dialogRef = this.dialog.open(PositionSimulatorComponent);
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = undefined;
            this.authService.userLocation$.subscribe({
                next: location => {
                    this.encounter = undefined;
                    this.userPosition.latitude = location.latitude;
                    this.userPosition.longitude = location.longitude;
                    if (this.mapComponent) {
                        this.mapComponent.setUserPositionMarker(
                            this.userPosition.latitude,
                            this.userPosition.longitude,
                        );
                    }
                },
            });
        });
    }

    nextEncounter(){
        this.mapComponent.removeMarkers();
        this.mapComponent.setUserPositionMarker(
            this.userPosition.latitude,
            this.userPosition.longitude,
        );
        this.encounterNumber = this.encounterNumber + 1;
        if (this.encounterNumber > this.filteredEncounters.length-1)
            this.encounterNumber = 0;
        this.service.getEncounterInstance(this.filteredEncounters.at(this.encounterNumber)?.Id || 0).subscribe(result => {
            this.loadEncounterInstance = result;
            this.encounter = this.filteredEncounters.at(this.encounterNumber);
            this.encounterInstance = this.loadEncounterInstance;
            if (this.loadEncounterInstance?.UserId !=0 && this.loadEncounterInstance?.Status === 0) {
                this.mapComponent.setEncounterActiveMarker(
                    this.encounter?.Latitude || 0,
                    this.encounter?.Longitude || 0,
                );
            }
            if (this.loadEncounterInstance?.UserId !=0 && this.loadEncounterInstance?.Status === 1) {
                this.mapComponent.setEncounterCompletedMarker(
                    this.encounter?.Latitude || 0,
                    this.encounter?.Longitude || 0,
                );
            }
            if (this.loadEncounterInstance?.UserId == 0) {
                this.mapComponent.setEncounterMarker(
                    this.encounter?.Latitude || 0,
                    this.encounter?.Longitude || 0,
                );
            }
            if(this.encounter?.Type == 1){
                this.mapComponent.setEncounterMarker(this.encounter?.PictureLatitude || 0, this.encounter?.PictureLongitude || 0);
            }

        })
    }

    completeEncounterOnMap() : void{
        this.mapComponent.removeMarkers();
        this.mapComponent.setEncounterCompletedMarker(
            this.encounter?.Latitude || 0,
            this.encounter?.Longitude || 0,
        );
    }
}
