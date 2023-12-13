import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValeoChargerComponent } from './valeo-charger/valeo-charger.component';
import { DateComponent } from './date/date.component';
import { TimeComponent } from './time/time.component';
import { StatusPlugComponent } from './status-plug/status-plug.component';
import { StatusBatteryComponent } from './status-battery/status-battery.component';
import { ZoneMessageComponent } from './zone-message/zone-message.component';
import { SmartChargingComponent } from './smart-charging/smart-charging.component';
import { DetailsComponent } from './details/details.component';
import { AFBWebSocketService } from './@core/services/AFB-websocket.service';
import { TuxEVSEService } from './@core/services/tux-evse.service';
import { ChargeInformationComponent } from './charge-information/charge-information.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StartStopComponent } from './start-stop/start-stop.component';
import { BorneInformationComponent } from './borne-information/borne-information.component';

@NgModule({
  declarations: [
    AppComponent,
    ValeoChargerComponent,
    DateComponent,
    TimeComponent,
    StatusPlugComponent,
    StatusBatteryComponent,
    ChargeInformationComponent,
    ZoneMessageComponent,
    SmartChargingComponent,
    DetailsComponent,
    HeaderComponent,
    StartStopComponent,
    BorneInformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    AFBWebSocketService,
    TuxEVSEService,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
