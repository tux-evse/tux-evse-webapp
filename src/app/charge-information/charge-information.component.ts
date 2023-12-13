import { Component, OnDestroy, OnInit } from '@angular/core';
import { IChargerInfo, TuxEVSEService } from '../@core/services/tux-evse.service';
import { Observable, Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'app-charge-information',
    templateUrl: './charge-information.component.html',
    styleUrls: ['./charge-information.component.scss']
})

export class ChargeInformationComponent implements OnInit, OnDestroy {

    chargerInfo: IChargerInfo = { energy: 0, duration: '??', temp: 0.0 };

    private destroy$: Subject<boolean> = new Subject();
    constructor(
        private tuxEvseService: TuxEVSEService,
    ) {
    }

    ngOnInit() {
        // Retrieve data from service
        this.tuxEvseService.getChargeInfo$().pipe(
            takeUntil(this.destroy$),
        )
        .subscribe(data => {
            this.chargerInfo = data;
        })
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
