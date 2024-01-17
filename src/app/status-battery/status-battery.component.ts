import { Component, OnInit } from '@angular/core';
import { AFBWebSocketService } from '../@core/services/AFB-websocket.service';
import { IBatteryInfo, EngyService } from '../@core/services/engy-service';


@Component({
    selector: 'app-status-battery',
    templateUrl: './status-battery.component.html',
    styleUrls: ['./status-battery.component.scss']
})

export class StatusBatteryComponent implements OnInit {

    battery: IBatteryInfo;

    /**
     * Constructs a new instance of the class.
     *
     * @param {EngyService} EngyService - The EngyService instance.
     */
    constructor(
        private EngyService: EngyService,
    ) {
    }

    /**
     * Initializes the component and retrieves battery information from the service.
     *
     * @return {void}
     */
    ngOnInit() {
        // Retrieve data from service
        this.EngyService.getBatteryInfo$().subscribe(data => {
            this.battery = data;
        })
    }
}
