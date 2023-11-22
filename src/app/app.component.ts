import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AFBWebSocketService, SocketStatus } from './@core/services/AFB-websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'valeo';
  wsStatus$: Observable<SocketStatus>;

  wifiStatus: string = 'off';

  constructor(
    private afbService: AFBWebSocketService,
  ) {
    afbService.Init('api', 'HELLO');
    // if (environment.production) {
        this.afbService.SetURL(window.location.host);
    // } else {
    //     afbService.SetURL('localhost', '1234');
    // }
  }

  ngOnInit() {
    this.afbService.Status$.subscribe(status => {
      if (status.connected) {
        this.wifiStatus = 'on';
      } else {
        this.wifiStatus = 'off';
      }
      console.log('AFB connection status:', status);
    })
    this.afbService.Connect();
  }

  restartConnection() {
    this.afbService.Disconnect();
    this.afbService.Connect();
  }
}
