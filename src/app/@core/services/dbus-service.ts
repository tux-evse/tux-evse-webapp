import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';


@Injectable()
export class DbusService {

    apiName = 'dbus';
    dbusData = '';
    private dbusDataSub = new BehaviorSubject(this.dbusData);

    constructor(
        private afbService: AFBWebSocketService,
    ) {

        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            // delay(5000),
            switchMap(() => {
                return this.afbService.Send(this.apiName + '/subscribe_nfc', '');
            }),
        ).subscribe((res: IAfbResponse) => {
            console.log('SLY dbus1 : ', res);
            if (res.request.code !== 0) {
                console.error('ERROR while subscribing to event:', res);
            }
             //  Update data on event in WS
             this.afbService.OnEvent('dbus/nfc_device_exists').subscribe(data => {
                if (data && data.data) {
                    this.dbusData = data.data;
                    console.log('SLY dbus2 : ', data.data);
                    this.dbusDataSub.next(this.dbusData);
                } else {
                    console.error('invalid tension data:', data);
                }
            });
        });
    }

    getDbusData$(): Observable<string> {
        return this.dbusDataSub.asObservable();
    }
}
