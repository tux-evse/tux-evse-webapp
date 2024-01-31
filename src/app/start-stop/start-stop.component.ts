import { Component } from '@angular/core';

@Component({
  selector: 'app-start-stop',
  templateUrl: './start-stop.component.html',
  styleUrls: ['./start-stop.component.scss']
})
export class StartStopComponent {
  btnDisabled: boolean = true;

  onStop() {
    alert('STOPPED !!!');
    this.btnDisabled = false;
  }
}
