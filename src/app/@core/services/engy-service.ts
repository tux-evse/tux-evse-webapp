import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, delay, distinctUntilKeyChanged, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';

export enum eMeterTagSet {
    Current = 'current',
    Tension = 'tension',
    Power = 'power',
    OverCurrent = 'overcurrent',
    Energy = 'energy',
    Unset = 'unset',
}

export interface IMeterData {
    tag?: eMeterTagSet;
    total: number;
    l1: number;
    l2: number;
    l3: number;
}

export interface MapMeterData {
    [key: string /*eMeterTagSet*/]: IMeterData;
}

@Injectable()
export class EngyService {

    apiName = 'engy';

    private meterData: MapMeterData = {
        [eMeterTagSet.Current]: { total: 0, l1: 0, l2: 0, l3: 0 },
        [eMeterTagSet.Tension]: { total: 0, l1: 0, l2: 0, l3: 0 },
        [eMeterTagSet.Power]: { total: 0, l1: 0, l2: 0, l3: 0 },
        [eMeterTagSet.OverCurrent]: { total: 0, l1: 0, l2: 0, l3: 0 },
        [eMeterTagSet.Energy]: { total: 0, l1: 0, l2: 0, l3: 0 },
        [eMeterTagSet.Unset]: { total: 0, l1: 0, l2: 0, l3: 0 },
    };
    private engyDataSub = new BehaviorSubject(this.meterData);

    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            switchMap(() => {
                return combineLatest([
                    this.afbService.Send(this.apiName + '/tension', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/energy', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/current', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/power', { 'action': 'subscribe' }),
                ]);
            })
        ).subscribe((res: IAfbResponse[]) => {
            if (res.length !== 3) {
                console.error('ERROR while subscribing to event for ', this.apiName, res);
                return;
            }
            for (let r of res) {
                if (r.request.status !== 'success') {
                    console.error('ERROR while subscribing, api', this.apiName, ' res=', r);
                }
            }

            //  Update data on event in WS
            this.afbService.OnEvent('engy/tension').subscribe(data => {
                if (data && data.data) {
                    this.meterData[eMeterTagSet.Tension] = data.data;
                    // console.log('SLY tension: ', data.data);
                    this.engyDataSub.next(this.meterData);
                } else {
                    console.error('invalid tension data:', data);
                }
            })

            this.afbService.OnEvent('engy/energy').subscribe(data => {
                if (data && data.data) {
                    this.meterData[eMeterTagSet.Energy] = data.data;
                    // console.log('SLY energy:', data.data);
                    this.engyDataSub.next(this.meterData);
                } else {
                    console.error('invalid energy data:', data);
                }
            })

            this.afbService.OnEvent('engy/current').subscribe(data => {
                if (data && data.data) {
                    this.meterData[eMeterTagSet.Current] = data.data;
                    // console.log('SLY current: ', data.data);
                    this.engyDataSub.next(this.meterData);
                } else {
                    console.error('invalid current data:', data);
                }
            })

            this.afbService.OnEvent('engy/power').subscribe(data => {
                if (data && data.data) {
                    this.meterData[eMeterTagSet.Power] = data.data;
                    // console.log('SLY power: ', data.data);
                    this.engyDataSub.next(this.meterData);
                } else {
                    console.error('invalid power data:', data);
                }
            })

        });
    }

    getAllEngyData$(): Observable<MapMeterData> {
        return this.engyDataSub.asObservable();
    }
}
