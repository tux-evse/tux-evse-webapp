import { Component, OnDestroy, OnInit } from '@angular/core';
import { EngyService, IMeterData, MapMeterData, eMeterTagSet } from '../@core/services/engy-service';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';


@Component({
    selector: 'app-charge-information',
    templateUrl: './charge-information.component.html',
    styleUrls: ['./charge-information.component.scss']
})

export class ChargeInformationComponent implements OnInit, OnDestroy {
    energyDelivered: number = 0;
    instantPower: number = 0;
    currentCharge: number = 0;
    powerCharge: number = 0;

    chargerCurrent$: Observable<IMeterData>;

    private destroy$: Subject<boolean> = new Subject();
    constructor(
        private EngyService: EngyService,
    ) {
    }

    ngOnInit() {
        this.chargerCurrent$ = this.EngyService.getCurrentData$().pipe(
            tap(d =>console.log('SEB this.chargerCurrent$ tap', d)),
            takeUntil(this.destroy$),
        );

        this.chargerCurrent$.subscribe(d => {
            console.log('SEB this.chargerCurrent$=', d);
        })

        this.EngyService.getAllEngyData$().pipe(
            takeUntil(this.destroy$),
        ).subscribe((meters: MapMeterData) => {
            if (meters[eMeterTagSet.Tension].total === 0 ||
                meters[eMeterTagSet.Current].total === 0) {
                this.instantPower = 1;
                this.energyDelivered = 1;
                return
            }

            this.instantPower = meters[eMeterTagSet.Power].l1;
            this.energyDelivered = meters[eMeterTagSet.Tension].total * meters[eMeterTagSet.Tension].total;
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
