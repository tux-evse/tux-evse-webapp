import { Component, OnInit } from '@angular/core';
import { AFBWebSocketService, IAfbResponse } from '../@core/services/AFB-websocket.service';
import { delay, filter, map, switchMap, tap } from 'rxjs';
import { IChargerInfo, TuxEVSEService } from '../@core/services/tux-evse.service';


@Component({
    selector: 'app-charge-information',
    templateUrl: './charge-information.component.html',
    styleUrls: ['./charge-information.component.scss']
})

export class ChargeInformationComponent implements OnInit {

    chargerInfo: IChargerInfo = { energy: 0, duration: '??', temp: 0.0 };

    constructor(
        private tuxEvseService: TuxEVSEService,
    ) {
    }

    ngOnInit() {

        // Retrieve data from service
        this.tuxEvseService.getChargeInfo$().subscribe(data => {
            this.chargerInfo = data;
        })
    }
}
