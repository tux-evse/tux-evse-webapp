import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AFBWebSocketService, SocketStatus } from '../@core/services/AFB-websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'valeo';
  wsStatus$: Observable<SocketStatus>;

  onDestroy: Subject<boolean> = new Subject();

  wifiStatus: string = 'off';
  nfcStatus: string = 'off';
  ethernetStatus: string = 'off';
  mobileStatus: string = 'off';

  constructor(
    private afbService: AFBWebSocketService,
  ){
    afbService.Init('api', 'HELLO');
    // if (environment.production) {
        this.afbService.SetURL(window.location.host);
    // } else {
    //     afbService.SetURL('localhost', '1235');
    // }
  }

  /**
   * Initializes the component.
   *
   * Subscribes to the Status$ Observable of the afbService to listen for changes in the connection status.
   * If the status is connected, sets the wifiStatus property to 'on', otherwise sets it to 'off'.
   * Logs the AFB connection status to the console.
   * Connects to the afbService.
   */
  ngOnInit() {
   this.afbService.Status$.pipe(
      takeUntil(this.onDestroy)
    ).subscribe(status => {
      if (status.connected) {
        this.wifiStatus = 'on';
        this.nfcStatus = 'on';
        this.ethernetStatus = 'on';
        this.mobileStatus = 'on';
      } else {
        this.wifiStatus = 'off';
        this.nfcStatus = 'off';
        this.ethernetStatus = 'off';
        this.mobileStatus = 'off';
      }
      console.log('AFB connection status:', status);
    })
    this.afbService.Connect();
  }

  ngOnDestroy() {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  restartConnection() {
    this.afbService.Disconnect();
    this.afbService.Connect();
  }
}
