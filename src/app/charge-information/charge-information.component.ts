import { Component, OnDestroy, OnInit } from '@angular/core';
import { EngyService, MapMeterData, eMeterTagSet } from '../@core/services/engy-service';
import { Observable, Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'app-charge-information',
    templateUrl: './charge-information.component.html',
    styleUrls: ['./charge-information.component.scss']
})

export class ChargeInformationComponent implements OnInit, OnDestroy {

    engyDataObs$: Observable<MapMeterData>;

    enumMeterTagSet = eMeterTagSet;

    private destroy$: Subject<boolean> = new Subject();
    constructor(
        private EngyService: EngyService,
    ) {
    }

    ngOnInit() {
        this.engyDataObs$ = this.EngyService.getAllEngyData$().pipe(
            takeUntil(this.destroy$),
        );
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
