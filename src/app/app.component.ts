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
  // wsStatus$: Observable<SocketStatus>;

  // wifiStatus: string = 'off';

  /**
   * Initializes the constructor of the class.
   *
   * @param {AFBWebSocketService} afbService - The AFBWebSocketService instance.
   */
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

  /**
   * Initializes the component.
   *
   * Subscribes to the Status$ Observable of the afbService to listen for changes in the connection status.
   * If the status is connected, sets the wifiStatus property to 'on', otherwise sets it to 'off'.
   * Logs the AFB connection status to the console.
   * Connects to the afbService.
   */
  // ngOnInit() {
  //   this.afbService.Status$.subscribe(status => {
  //     if (status.connected) {
  //       this.wifiStatus = 'on';
  //     } else {
  //       this.wifiStatus = 'off';
  //     }
  //     console.log('AFB connection status:', status);
  //   })
  //   this.afbService.Connect();
  // }

  // restartConnection() {
  //   this.afbService.Disconnect();
  //   this.afbService.Connect();
  // }
}
