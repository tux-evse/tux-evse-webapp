import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AFBWebSocketService, SocketStatus } from './@core/services/AFB-websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'valeo';
  constructor(
    private afbService: AFBWebSocketService,
  ) {
    afbService.Init('api', 'HELLO');
    // if (environment.production) {
        this.afbService.SetURL(window.location.host);
    // } else {
    //     afbService.SetURL('localhost', '1235');
    // }
  }
}
