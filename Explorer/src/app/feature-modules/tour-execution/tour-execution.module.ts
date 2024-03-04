import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PurchasedToursComponent } from "./purchased-tour-cards/purchased-tour-cards.component";
import { PurchasedTourCardComponent } from "./purchased-tour-card/purchased-tour-card.component";
import { TouristPositionSimulatorComponent } from "./tourist-position-simulator/tourist-position-simulator.component";
import { SharedModule } from "src/app/shared/shared.module";
import { TourExecutingComponent } from "./tour-executing/tour-executing.component";
import { ClickedKeyPointComponent } from "./clicked-key-point/clicked-key-point.component";
import { TourExecutionHistoryComponent } from "./tour-execution-history/tour-execution-history.component";
import { KeyPointsViewComponent } from "./key-points-view/key-points-view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { TourExecutionInfoComponent } from "./tour-execution-info/tour-execution-info.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { SecretPopupComponent } from './secret-popup/secret-popup.component';
import { CampaignEquipmentComponent } from './campaign-equipment/campaign-equipment.component';
import { TourWheatherComponent } from './tour-wheather/tour-wheather.component';
import { TourCompletedPopupComponent } from './tour-completed-popup/tour-completed-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        PurchasedToursComponent,
        PurchasedTourCardComponent,
        TouristPositionSimulatorComponent,
        TourExecutingComponent,
        ClickedKeyPointComponent,
        TourExecutionHistoryComponent,
        KeyPointsViewComponent,
        TourExecutionInfoComponent,
        CampaignCardComponent,
        SecretPopupComponent,
        CampaignEquipmentComponent,
        TourWheatherComponent,
        TourCompletedPopupComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FontAwesomeModule,
        TourAuthoringModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        BrowserAnimationsModule,
    ],
})
export class TourExecutionModule {}
