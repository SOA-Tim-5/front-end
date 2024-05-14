import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { environment } from "src/env/environment";
import { Encounter } from "./model/encounter.model";
import { KeyPointEncounter } from "./model/key-point-encounter.model";
//import { TouristPosition } from "../tour-execution/model/tourist-position.model";
import { TouristPosition } from "./model/TouristPosition.model";
import { UserPositionWithRange } from "./model/user-position-with-range.model";
import { EncounterInstanceResponseDto } from "./model/encounter-instance.model";
import { ListEncounterResponseDto } from "./model/ListEncounterResponseDto.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { use } from "marked";
import { EncoounterInstanceId } from "./model/EncounterInstanceId.model";

@Injectable({
    providedIn: "root",
})
export class EncounterService {
    getEncounterForKeyPoint(
        keyPointId: number,
        touristPosition: TouristPosition,
    ): Observable<KeyPointEncounter> {
        return this.http.post<KeyPointEncounter>(
            environment.apiHost + "tourist/encounter/key-point/" + keyPointId,
            touristPosition,
        );
    }
    createKeyPointEncounter(
        keyPointEncounter: KeyPointEncounter,
    ): Observable<KeyPointEncounter> {
        return this.http.post<KeyPointEncounter>(
            environment.apiHost + "author/encounter",
            keyPointEncounter,
        );
    }

    constructor(private http: HttpClient, private authService: AuthService) {}

    getActiveEncounters(): Observable<PagedResults<Encounter>> {
        return this.http.get<PagedResults<Encounter>>(
            environment.apiHost + "administrator/encounter/active",
        );
    }

    getAllEncounters(
        currentUserId: number,
        page: number,
        pageSize: number,
    ): Observable<Encounter[]> {
        const params = {
            currentUserId: currentUserId.toString(),
            page: page.toString(),
            pageSize: pageSize.toString(),
        };

        return this.http.get<Encounter[]>(
            environment.apiHost + "tourist/encounter/done-encounters",
            { params: params },
        );
    }

    getEncounterInstance(encounterId: number): Observable<EncounterInstanceResponseDto> {
        var userId=0;
        this.authService.user$.subscribe(res => {
            userId = res.id;
        });
        return this.http.get<EncounterInstanceResponseDto>(
            environment.apiHost + `tourist/encounter/${encounterId}/${userId}/instance`,
        );
    }

    getEncountersInRangeOf(
        userPositionWithRange: UserPositionWithRange,
    ): Observable<ListEncounterResponseDto> {
        return this.http.post<ListEncounterResponseDto>(
            environment.apiHost + "tourist/encounter/in-range-of",
            userPositionWithRange,
        );
    }

    activateEncounter(
        userPositionWithRange: UserPositionWithRange,
        encounterId: number,
    ): Observable<PagedResults<Encounter>> {
        var userId=0;
        this.authService.user$.subscribe(res => {
            userId = res.id;
        });
        const touristPoistion:TouristPosition={
            TouristId:userId,
            Longitude:userPositionWithRange.longitude,
            Latitude:userPositionWithRange.latitude,
            EncounterId:encounterId,
        }
        return this.http.post<PagedResults<Encounter>>(
            environment.apiHost + `tourist/encounter/activate`,
            touristPoistion
        );
    }

    checkIfUserInCompletionRange(
        userPositionWithRange: UserPositionWithRange,
        encounterId: number,
    ): Observable<boolean> {
        return this.http.post<boolean>(
            environment.apiHost +
                `tourist/hidden-location-encounter/${encounterId}/check-range`,
            userPositionWithRange,
        );
    }

    getHiddenLocationEncounterById(encounterId: number): Observable<Encounter> {
        return this.http.get<Encounter>(
            environment.apiHost +
                "tourist/hidden-location-encounter/" +
                encounterId,
        );
    }

    completeHiddenLocationEncounter(
        userPositionWithRange: UserPositionWithRange,
        encounterId: number,
    ): Observable<Encounter> {
        return this.http.post<Encounter>(
            environment.apiHost +
                `tourist/hidden-location-encounter/${encounterId}/complete`,
            userPositionWithRange,
        );
    }

    completeEncounter(
        userPositionWithRange: UserPositionWithRange,
        encounterId: number,
    ): Observable<Encounter> {
        var userId=0;
        this.authService.user$.subscribe(res => {
            userId = res.id;
        });
        const encounterIndtanceId:EncoounterInstanceId={
            Id:userId,
            EncounterId:encounterId,
        }
        return this.http.post<Encounter>(
            environment.apiHost + `tourist/encounter/complete/misc`,
            encounterIndtanceId,
        );
    }

    completeSocialEncounter(
        userPositionWithRange: UserPositionWithRange,
        encounterId: number,
    ): Observable<Encounter> {
        var userId=0;
        this.authService.user$.subscribe(res => {
            userId = res.id;
        });
        const touristPoistion:TouristPosition={
            TouristId:userId,
            Longitude:userPositionWithRange.longitude,
            Latitude:userPositionWithRange.latitude,
            EncounterId:encounterId,
        }
        return this.http.post<Encounter>(
            environment.apiHost + `tourist/encounter/complete/social`,
            touristPoistion,
        );
    }

    createSocialEncounter(
        socialEncounter: Encounter,
        isTourist: Boolean,
    ): Observable<Encounter> {
        const role = isTourist ? "tourist" : "author";
        return this.http.post<Encounter>(
            environment.apiHost + role + "/social-encounter/create",
            socialEncounter,
        );
    }

    createHiddenEncounter(
        hiddenEncounter: Encounter,
        isTourist: Boolean,
    ): Observable<Encounter> {
        const role = isTourist ? "tourist" : "author";
        return this.http.post<Encounter>(
            environment.apiHost + role + "/hidden-location-encounter/create",
            hiddenEncounter,
        );
    }

    createMiscEncounter(
        miscEncounter: Encounter,
        isTourist: Boolean,
    ): Observable<Encounter> {
        const role = isTourist ? "tourist" : "author";
        return this.http.post<Encounter>(
            environment.apiHost + role + "/misc-encounter/createMisc",
            miscEncounter,
        );
    }

    uploadImage(image: File): Observable<string> {
        let formData = new FormData();
        formData.append("image", image);
        return this.http.post(environment.apiHost + "images", formData, {
            responseType: "text",
        });
    }
}
