
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, delay, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';

export enum ePlugState {
    PlugIn = 'plugin',
    Lock = 'lock',
    Error = 'error',
    PlugOut = 'plugout',
    Unknown = 'unknown',
}

export enum ePowerRequest {
    Start = 'start',
    Charging = 'charging',
    Stop = 0,
    Unknown = 'unknown',
}

export enum eIsoState {
    Iso20,
    Iso2,
    Iec,
    Unset,
}

export enum eAuthMsg {
    Done,
    Fail,
    Pending,
    Idle,
    Unknown,
}

export interface IChargingState {
    imax?: Number;
    pmax?: Number;
    plugged: ePlugState;
    power: ePowerRequest;
    iso: eIsoState;
    auth: eAuthMsg;
}

export interface IChargingMsg {
    Plugged?: ePlugState,
    Power?: ePowerRequest,
    Iso?: eIsoState,
    Auth?: eAuthMsg,
    State?: IChargingState,
}


@Injectable()
export class ChMgrService {

    apiName = 'chmgr';

    private chargingState: IChargingState = {
        imax: 0,
        pmax: 0,
        plugged: ePlugState.Unknown,
        power: ePowerRequest.Unknown,
        iso: eIsoState.Unset,
        auth: eAuthMsg.Unknown,
    };
    private chargingStateSub = new BehaviorSubject(this.chargingState);
    private plugStateSub = new BehaviorSubject(this.chargingState.plugged);
    private powerStateSub = new BehaviorSubject(this.chargingState.power);
    private isoStateSub = new BehaviorSubject(this.chargingState.iso);
    private authStateSub = new BehaviorSubject(this.chargingState.auth);

    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(500),     // TODO: understand if we really need it ?
            switchMap(() => {
                return combineLatest([
                    this.afbService.Send(this.apiName + '/state', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/subscribe', true),
                ]);
            })
        ).subscribe((res: IAfbResponse[]) => {
            if (res.length !== 2) {
                console.error('ERROR while subscribing to event for ', this.apiName, res);
                return;
            }
            if (res[0].request.status !== 'success') {
                console.error('ERROR while subscribing to charging-state (/state) to event ', res[0]);
            }
            if (res[1].request.status !== 'success') {
                console.error('ERROR while subscribing to subscribe-msg (/subscribe) to event ', res[1]);
            }

            // TODO - populate initial state


            //  Update data on event in WS
            this.afbService.OnEvent('*').subscribe(data => {
                if (data.event === this.apiName + '/state') {
                    if (data && data.data) {
                        const cm = <IChargingMsg>data.data;

                        if (cm.Power) {
                            this.chargingState.power = cm.Power;
                            this.powerStateSub.next(this.chargingState.power);
                            this.chargingStateSub.next(this.chargingState);

                        } else if (cm.Auth) {
                            this.chargingState.auth = cm.Auth;
                            this.authStateSub.next(this.chargingState.auth);
                            this.chargingStateSub.next(this.chargingState);

                        } else if (cm.Iso) {
                            this.chargingState.iso = cm.Iso;
                            this.isoStateSub.next(this.chargingState.iso);
                            this.chargingStateSub.next(this.chargingState);

                        } else if (cm.Plugged) {
                            this.chargingState.plugged = cm.Plugged;
                            this.plugStateSub.next(this.chargingState.plugged);
                            this.chargingStateSub.next(this.chargingState);

                        } else if (cm.State) {
                            this.chargingState = cm.State;
                            this.chargingStateSub.next(this.chargingState);

                        } else {
                            console.error('Unknown event state type:', data);
                        }
                    }
                } else {
                    console.error('Unknown event api name:', data);
                }
            });
        });
    }

    getChargingState(): Observable<IChargingState> {
        return this.afbService.Send(this.apiName + '/state', { 'action': 'read' }).pipe(
            map(data => data?.response),
            take(1),
        );
    }

    getChargingState$(): Observable<IChargingState> {
        return this.chargingStateSub.asObservable();
    }

    getPlugState$(): Observable<ePlugState> {
        return this.plugStateSub.asObservable();
    }

    getPowerState$(): Observable<ePowerRequest> {
        return this.powerStateSub.asObservable();
    }

    getIsoState$(): Observable<eIsoState> {
        return this.isoStateSub.asObservable();
    }

    getAuthState$(): Observable<eAuthMsg> {
        return this.authStateSub.asObservable();
    }

}
