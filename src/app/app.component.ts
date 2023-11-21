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
    afbService.SetURL('localhost', '1234');
  }

  ngOnInit() {
    // (wsStatus$ | async)?.connected ?'on':'off' 
    // this.wsStatus$ = this.afbService.Status$;
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
