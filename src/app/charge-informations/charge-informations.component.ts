import { Component, OnInit } from '@angular/core';
import { AFBWebSocketService, IAfbResponse } from '../@core/services/AFB-websocket.service';
import { delay, filter, map, switchMap, tap } from 'rxjs';

export interface IChargerInfo {
    energy: Number;
    duration: String;
    temp: Number;
}

@Component({
    selector: 'app-charge-informations',
    templateUrl: './charge-informations.component.html',
    styleUrls: ['./charge-informations.component.scss']
})

export class ChargeInformationsComponent implements OnInit {

    chargerInfo: IChargerInfo = { energy: 0, duration: '??', temp: 0.0 };

    constructor(
        private afbService: AFBWebSocketService,
    ) {
    }


    ngOnInit() {

        // Load inital data on startup
        this.afbService.InitDone$.pipe(
            filter(done => done),
            map(() => {
                return this.afbService.Send('tux-evse-mock/charger-info', {});
            }),
            switchMap((data) => {
                return data;
            })
        ).subscribe((dataAfb: IAfbResponse) => {
            this.chargerInfo = dataAfb.response;
            // console.log('SEB info=', dataAfb);
        });

        // this.afbService.InitDone$.pipe(
        //   filter(done => done),
        //   delay(1000),
        //   map(() => {
        //     console.log('SEB call subscribe')
        //     return this.afbService.Send('tux-evse-mock/subscribe', {});
        //   })
        //   // filter((res: IAfbResponse) => res.response === 'ok'),
        //   switchMap((res) => {
        //     console.log('SEB return of subscribe =',res)
        //     console.log('SEB call OnEvent *')
        //     return this.afbService.OnEvent('*');
        //   })
        // ).subscribe(data => {
        //   console.log('SEB EVENTinfo=', data);
        //   if (data.event === 'charger-info') {
        //     this.chargerInfo = data.data;
        //   }
        // });

        this.afbService.OnEvent('*').subscribe(data => {
            if (data.event === 'tux-evse-mock/py-tux-evse-mock') {
                this.chargerInfo = data.data?.chargerInfo
            }
        });

        this.afbService.InitDone$.pipe(
            filter(done => done),
            delay(1000),
            switchMap(() => {
                // console.log('SEB call subscribe')
                return this.afbService.Send('tux-evse-mock/subscribe', {});
            })
        ).subscribe((res: IAfbResponse) => {
            if (res.response === 'ok') {
                // this.afbService.OnEvent('*').subscribe(data => {
                //   console.log('SEB EVENTinfo=', data);
                //   if (data.event === 'charger-info') {
                //     this.chargerInfo = data.data;
                //   }
                // });
            }
        });
    }
}
