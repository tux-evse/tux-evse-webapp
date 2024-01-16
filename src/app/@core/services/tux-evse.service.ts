
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';

export interface IChargerInfo {
    energy: Number;
    duration: String;
    temp: Number;
}

export interface IBatteryInfo {
    chargeValue: Number;
}

export interface IborneStatus {
    borneStatus: Number;
}


@Injectable()
export class TuxEVSEService {

    apiName = 'tux-evse-webapp-mock';

    private chargerInfo: IChargerInfo = { energy: 0, duration: '??', temp: 0.0 };
    private chargerInfoSub = new BehaviorSubject(this.chargerInfo);

    private batInfo: IBatteryInfo = {chargeValue: 0};
    private batInfoSub = new BehaviorSubject(this.batInfo);


    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Load initial data on startup
        this.afbService.InitDone$.pipe(
            filter(done => done),
            map(() => {
                return this.afbService.Send(this.apiName + '/charger-info', {});
            }),
            switchMap((data) => {
                return data;
            }),
            take(1),
        ).subscribe((dataAfb: IAfbResponse) => {
            this.chargerInfo = dataAfb.response;

            // Update data on event in WS
            this.afbService.OnEvent('*').subscribe(data => {
                if (data.event === this.apiName + '/py-tux-evse-mock') {
                    if (data && data.data) {
                        if (data.data.chargerInfo) {
                        this.chargerInfo = data.data.chargerInfo;
                        this.chargerInfoSub.next(this.chargerInfo);
                        }
                        if (data.data.batteryInfo) {
                            this.batInfo = data.data.batteryInfo;
                            this.batInfoSub.next(this.batInfo);
                        }
                    }
                }
            });
        });

        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(500),
            switchMap(() => {
                return this.afbService.Send(this.apiName + '/subscribe', {});
            })
        ).subscribe((res: IAfbResponse) => {
            if (res.request.code !== 0) {
                console.error('ERROR while subscribing to event:', res);
            }
        });
    }

    getChargeInfo$(): Observable<IChargerInfo> {
        return this.chargerInfoSub.asObservable();
    }

    getBatteryInfo$(): Observable<IBatteryInfo> {
        return this.batInfoSub.asObservable();
    }
}
