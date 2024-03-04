import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TourComponent } from "./tour/tour.component";
import { TourFormComponent } from "./tour-form/tour-form.component";
import { KeyPointsComponent } from "./key-points/key-points.component";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { KeyPointFormComponent } from "./key-point-form/key-point-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { FacilitiesComponent } from "./facilities/facilities.component";
import { FacilitiesFormComponent } from "./facilities-form/facilities-form.component";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "src/app/shared/shared.module";
import { TourEquipmentFormComponent } from "./tour-equipment-form/tour-equipment-form.component";
import { RouterModule } from "@angular/router";
import { KeyPointCardComponent } from "./key-point-card/key-point-card.component";
import { PublicKeyPointsComponent } from "./public-key-points/public-key-points.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatDialogModule } from "@angular/material/dialog";
import { FacilityCardComponent } from "./facility-card/facility-card.component";
import { AddTourFormComponent } from "./add-tour-form/add-tour-form.component";
import { EditTourFormComponent } from "./edit-tour-form/edit-tour-form.component";
import { TouristsTourComponent } from "./tourists-tour/tourists-tour.component";
import { AddTouristsTourFormComponent } from "./add-tourists-tour-form/add-tourists-tour-form.component";
import { EditTouristsTourFormComponent } from "./edit-tourists-tour-form/edit-tourists-tour-form.component";
import { TouristsKeyPointsComponent } from "./tourists-key-points/tourists-key-points.component";
import { RecommendedTourCardComponent } from "./recommended-tour-card/recommended-tour-card.component";
import { TouristsEquipmentComponent } from "./tourists-equipment/tourists-equipment.component";
import { FormsModule } from "@angular/forms";
import { BundlesComponent } from "./bundles/bundles.component";
import { BundleCardComponent } from "./bundle-card/bundle-card.component";
import { AddBundleFormComponent } from "./add-bundle-form/add-bundle-form.component";
import { EditBundleFormComponent } from "./edit-bundle-form/edit-bundle-form.component";
import { ViewBundleToursComponent } from "./view-bundle-tours/view-bundle-tours.component";
import { EncounterModule } from "../encounter/encounter.module";
import { MatChipsModule } from "@angular/material/chips";
import { PublishTourModalComponent } from "./publish-tour-modal/publish-tour-modal.component";
import { KeyPointModalComponent } from "./key-point-modal/key-point-modal.component";
import { TooltipModule } from "primeng/tooltip";
import { FacilityModalComponent } from "./facility-modal/facility-modal.component";
import { TourStatisticsComponent } from "./tour-statistics/tour-statistics.component";
import { SingleTourStatisticsComponent } from "./single-tour-statistics/single-tour-statistics.component";
import { KeyPointStatisticsCardComponent } from "./key-point-statistics-card/key-point-statistics-card.component";

@NgModule({
    declarations: [
        TourComponent,
        TourFormComponent,
        KeyPointsComponent,
        KeyPointFormComponent,
        FacilitiesFormComponent,
        FacilitiesComponent,
        TourEquipmentFormComponent,
        KeyPointCardComponent,
        PublicKeyPointsComponent,
        FacilityCardComponent,
        AddTourFormComponent,
        EditTourFormComponent,
        TouristsTourComponent,
        AddTouristsTourFormComponent,
        EditTouristsTourFormComponent,
        TouristsKeyPointsComponent,
        RecommendedTourCardComponent,
        TouristsEquipmentComponent,
        BundlesComponent,
        BundleCardComponent,
        AddBundleFormComponent,
        EditBundleFormComponent,
        ViewBundleToursComponent,
        PublishTourModalComponent,
        KeyPointModalComponent,
        FacilityModalComponent,
        TourStatisticsComponent,
        SingleTourStatisticsComponent,
        KeyPointStatisticsCardComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        MatSelectModule,
        SharedModule,
        RouterModule,
        FontAwesomeModule,
        MatDialogModule,
        FormsModule,
        EncounterModule,
        MatChipsModule,
        TooltipModule,
    ],
    exports: [
        TourComponent,
        TourFormComponent,
        MatCardModule,
        MatButtonModule,
        KeyPointsComponent,
        KeyPointFormComponent,
        FacilitiesComponent,
        FacilitiesFormComponent,
        TourEquipmentFormComponent,
        KeyPointCardComponent,
        BundlesComponent,
        BundleCardComponent,
        TourStatisticsComponent,
    ],
})
export class TourAuthoringModule {}
