import { Component, OnInit } from '@angular/core';
import { AFBWebSocketService } from '../@core/services/AFB-websocket.service';
import { IBatteryInfo, TuxEVSEService } from '../@core/services/tux-evse.service';


@Component({
    selector: 'app-status-battery',
    templateUrl: './status-battery.component.html',
    styleUrls: ['./status-battery.component.scss']
})

export class StatusBatteryComponent implements OnInit {

    battery: IBatteryInfo;

    constructor(
        private tuxEvseService: TuxEVSEService,
    ) {
    }

    ngOnInit() {
        // Retrieve data from service
        this.tuxEvseService.getBatteryInfo$().subscribe(data => {
            this.battery = data;
        })
    }
}
