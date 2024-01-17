
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';


@Injectable()
export class AuthService {

    apiName = 'auth';


    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // // Load initial data on startup
        // this.afbService.InitDone$.pipe(
        //     filter(done => done),
        //     map(() => {
        //         return this.afbService.Send(this.apiName + '/charger-info', {});
        //     }),
        //     switchMap((data) => {
        //         return data;
        //     }),
        //     take(1),
        // ).subscribe((dataAfb: IAfbResponse) => {
        //     this.chargerInfo = dataAfb.response;

        //     // Update data on event in WS
        //     this.afbService.OnEvent('*').subscribe(data => {
        //         if (data.event === this.apiName + '/py-tux-evse-mock') {
        //             if (data && data.data) {
        //                 if (data.data.chargerInfo) {
        //                 this.chargerInfo = data.data.chargerInfo;
        //                 this.chargerInfoSub.next(this.chargerInfo);
        //                 }
        //                 if (data.data.batteryInfo) {
        //                     this.batInfo = data.data.batteryInfo;
        //                     this.batInfoSub.next(this.batInfo);
        //                 }
        //             }
        //         }
        //     });
        // });

        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(500),
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
