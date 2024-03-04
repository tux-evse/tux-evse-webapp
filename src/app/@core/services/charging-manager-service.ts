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
    Idle = 'idle',
    Stop = 0,
    Unknown = 'unknown',
}

export enum eIsoState {
    Iso20 = 'iso20',
    Iso2 = 'iso2',
    Iso3 = 'iso3',
    Iec = 'iec',
    Unset = 'unset',
}

export enum eAuthMsg {
    Done = 'done',
    Fail = 'fail',
    Pending = 'pending',
    Idle = 'idle',
    Unknown = 'unknown',
}

export interface IChargingState {
    updated?: boolean;
    imax?: Number;
    pmax?: Number;
    plugged: ePlugState;
    power: ePowerRequest;
    iso: eIsoState;
    auth: eAuthMsg;
}

export interface IChargingMsg {
    plugged?: ePlugState,
    power?: ePowerRequest,
    iso?: eIsoState,
    auth?: eAuthMsg,
    state?: IChargingState,
}


@Injectable()
export class ChMgrService {

    apiName = 'chmgr';

    private chargingState: IChargingState = {
        updated: false,
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

    private StateSub$ = new BehaviorSubject(this.chargingState);

    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            switchMap(() => {
                return combineLatest([
                    // this.afbService.Send(this.apiName + '/state', { 'action': 'subscribe' }),

                    this.afbService.Send(this.apiName + '/subscribe', true),
                ]);
            })
        ).subscribe((res: IAfbResponse[]) => {
            if (res.length !== 1) {
                console.error('ERROR while subscribing to event for ', this.apiName, res);
                return;
            }
            // if (res[0].request.status !== 'success') {
            //     console.error('ERROR while subscribing to charging-state (/state) to event ', res[0]);
            // }
            if (res[0].request.status !== 'success') {
                console.error('ERROR while subscribing to subscribe-msg (/subscribe) to event ', res[0]);
            }

            // TODO - populate initial state


            //  Update data on event in WS
            this.afbService.OnEvent('*').subscribe(data => {
                if (data.event === this.apiName + '/msg') {
                    console.log('Charging state updated', data);
                    if (data && data.data) {
                        if (data.data?.plugged) {
                            console.log('Charging state plugged', data.data?.plugged);
                            this.chargingState.plugged = data.data?.plugged;
                            this.plugStateSub.next(this.chargingState.plugged);
                        }
                        if (data.data?.power) {
                            console.log('Charging state power', data.data?.power);
                            if (typeof data.data.power === 'string') {
                                if (data.data.power === 'idle') {
                                    this.chargingState.power = ePowerRequest.Idle;
                                } else if (data.data.power === 'charging') {
                                    this.chargingState.power = ePowerRequest.Charging;
                                } else if (data.data.power === 'start') {
                                    this.chargingState.power = ePowerRequest.Start;
                                }
                            } else if (typeof data.data.power === 'object') {
                                if ('stop' in data.data.power) {
                                    this.chargingState.power = ePowerRequest.Stop;
                                } else if ('charging' in data.data.power) {
                                    this.chargingState.power = ePowerRequest.Charging;
                                }
                            }
                            
                           
                            this.powerStateSub.next(this.chargingState.power);
                        }
                        if (data.data?.iso) {
                            console.log('Charging state iso', data.data?.iso);
                            this.chargingState.iso = data.data?.iso;
                            this.isoStateSub.next(this.chargingState.iso);
                        }
                        if (data.data?.auth) {
                            console.log('Charging state auth', data.data?.auth);
                            this.chargingState.auth = data.data?.auth;
                            this.authStateSub.next(this.chargingState.auth);
                        }
                        // const cm = <IChargingMsg>data.data;

                            // this.chargingState = <IChargingState>{auth: cm.auth,iso: cm.iso,plugged: cm.plugged,power: cm.power};

                            // this.powerStateSub.next(this.chargingState.power);

                            // this.authStateSub.next(this.chargingState.auth);

                            // this.isoStateSub.next(this.chargingState.iso);

                            // this.plugStateSub.next(this.chargingState.plugged);

                            // this.chargingStateSub.next(this.chargingState);
                    }
                } else {
                    // console.error('Update data on event in WS : Unknown event api name:', data);
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
