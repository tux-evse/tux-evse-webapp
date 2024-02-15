
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';


@Injectable()
export class DbusService {

    apiName = 'dbus';


    constructor(
        private afbService: AFBWebSocketService,
    ) {

        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            // delay(1000),
            switchMap(() => {
                return this.afbService.Send(this.apiName + '/subscribe', 'true');
            })
        ).subscribe((res: IAfbResponse) => {
            if (res.request.code !== 0) {
                console.error('ERROR while subscribing to event:', res);
            }
        });
    }

    
}
