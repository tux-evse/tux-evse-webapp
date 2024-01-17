import { Component, OnDestroy, OnInit } from '@angular/core';
import { IChargerInfo, EngyService } from '../@core/services/engy-service';
import { ChMgrService } from '../@core/services/charging-manager-service';
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
        private EngyService: EngyService,
        private ChMgrService: ChMgrService,
    ) {
    }

    ngOnInit() {
        this.EngyService.getTensionVolts().subscribe(res => console.log('SEB res', res));

        // Retrieve data from service
        this.EngyService.getChargeInfo$().pipe(
            takeUntil(this.destroy$),
        )
        .subscribe(data => {
            this.chargerInfo = data;
        })

        this.ChMgrService.getChargeInfo$().pipe(
            takeUntil(this.destroy$),
        ).subscribe(data => {
            console.log('SEB EVENT getChargeInfo$ data', data)
        })
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
