
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, delay, distinctUntilKeyChanged, filter, map, switchMap, take } from 'rxjs';
import { AFBWebSocketService, IAfbResponse } from './AFB-websocket.service';

export enum eMeterTagSet {
    Current,
    Tension,
    Power,
    OverCurrent,
    Energy,
    Unset,
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

    private meterData: MapMeterData = {};
    private engyDataSub = new BehaviorSubject(this.meterData);

    constructor(
        private afbService: AFBWebSocketService,
    ) {
        // Now subscribe to event
        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(500),     // TODO: understand if we really need it ?
            switchMap(() => {
                return combineLatest([
                    this.afbService.Send(this.apiName + '/tension', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/energy', { 'action': 'subscribe' }),
                    this.afbService.Send(this.apiName + '/current', { 'action': 'subscribe' }),
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
            this.afbService.OnEvent('*').subscribe(data => {
                if (data.event === this.apiName + '/tension') {
                    if (data && data.data) {
                        this.meterData[eMeterTagSet.Tension] = data.data;
                        this.engyDataSub.next(this.meterData);
                    } else {
                        console.error('invalid tension data:', data);
                    }
                } else if (data.event === this.apiName + '/energy') {
                    if (data && data.data) {
                        this.meterData[eMeterTagSet.Energy] = data.data;
                        this.engyDataSub.next(this.meterData);
                    } else {
                        console.error('invalid energy data:', data);
                    }
                } else if (data.event === this.apiName + '/current') {
                    if (data && data.data) {
                        this.meterData[eMeterTagSet.Current] = data.data;
                        this.engyDataSub.next(this.meterData);
                    } else {
                        console.error('invalid current data:', data);
                    }

                } else {
                    console.error('unknown data type:', data);
                }
            });
        });
    }

    getAllEngyData$(): Observable<MapMeterData> {
        return this.engyDataSub.asObservable();
    }

    getTensionData$(): Observable<IMeterData> {
        return this.engyDataSub.asObservable().pipe(
            map(data => this.adjustMeter(data[eMeterTagSet.Tension])),
            distinctUntilKeyChanged('total'),
        );
    }

    getEnergyData$(): Observable<IMeterData> {
        return this.engyDataSub.asObservable().pipe(
            map(data => this.adjustMeter(data[eMeterTagSet.Energy])),
            distinctUntilKeyChanged('total'),
        );
    }

    getCurrentData$(): Observable<IMeterData> {
        return this.engyDataSub.asObservable().pipe(
            map(data => this.adjustMeter(data[eMeterTagSet.Current])),
            distinctUntilKeyChanged('total'),
        );
    }

    private adjustMeter(d: IMeterData): IMeterData {
        d.total /= 100.0;
        d.l1 /= 100.0;
        d.l2 /= 100.0;
        d.l3 /= 100.0;
        return d;
    }
}
