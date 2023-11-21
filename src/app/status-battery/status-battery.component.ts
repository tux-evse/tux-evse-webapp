import { Component, OnInit } from '@angular/core';
import { AFBWebSocketService } from '../@core/services/AFB-websocket.service';


export interface IBatteryInfo {
    chargeValue: Number;
}


@Component({
    selector: 'app-status-battery',
    templateUrl: './status-battery.component.html',
    styleUrls: ['./status-battery.component.scss']
})

export class StatusBatteryComponent implements OnInit {

    battery: IBatteryInfo = { chargeValue: 0 };

    constructor(
        private afbService: AFBWebSocketService,
    ) {
    }

    ngOnInit() {
        this.afbService.OnEvent('*').subscribe(data => {
            // console.log('SEB BAT EVENTinfo=', data);
            if (data.event === 'tux-evse-mock/py-tux-evse-mock') {
                this.battery = data.data?.batteryInfo
            }
        });
    }
}
