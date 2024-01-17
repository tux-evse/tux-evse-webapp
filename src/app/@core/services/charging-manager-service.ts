
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';


export interface IChargingState {
    imax: Number;
    pmax: Number;
    plugged: string;
    power: string;
    iso: string;
    auth: string;
}

@Injectable()
export class ChMgrService { 

    apiName = 'chmgr';

    private chargingState: IChargingState = {
        imax: 0, pmax: 0, plugged: '', power: '', iso: '', auth: ''};
    private chargingStateSub = new BehaviorSubject(this.chargingState);


    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(500),
            switchMap(() => {
                // return [
                //     this.afbService.Send(this.apiName + '/state', {'state': 'subscribe'},
                // this.afbService.Send(this.apiName + '/subscribe', true),
                // ];
                console.log('SEBBBBBBBBBBBBBBBB ', this.apiName) 
                return this.afbService.Send(this.apiName + '/state', { 'action': 'subscribe' });
            })
        ).subscribe((res: IAfbResponse) => {
            if (res.request.code !== 0) {
                console.error('ERROR while subscribing to event:', res);
                return;
            }

            //  Update data on event in WS
            this.afbService.OnEvent('*').subscribe(data => {
                if (data.event === this.apiName + '/chmgr/state') {
                    if (data && data.data) {
                        this.chargingState = data.data;
                        this.chargingStateSub.next(this.chargingState);
                    }
                }
            });
        });
    }

    getChargingState(): Observable<IChargingState> {
        return this.afbService.Send(this.apiName + '/state', { 'action': 'read' }).pipe(
            map(data => data?.response),
        );
    }

    getChargeInfo$(): Observable<IChargingState> {
        return this.chargingStateSub.asObservable();
    }

}
