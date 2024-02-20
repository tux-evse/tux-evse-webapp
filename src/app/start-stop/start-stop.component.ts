import { Component, OnInit } from '@angular/core';
import { ChMgrService, ePowerRequest } from '../@core/services/charging-manager-service';

@Component({
  selector: 'app-start-stop',
  templateUrl: './start-stop.component.html',
  styleUrls: ['./start-stop.component.scss']
})
export class StartStopComponent implements OnInit {
  btnDisabled: boolean = false;
  chargeStatus: ePowerRequest = ePowerRequest.Unknown;

  onStop() {
    alert('STOPPED !!!');
    this.btnDisabled = true;
  }

  constructor(
    private ChMgrService: ChMgrService,
  ) { }

  ngOnInit(): void {
    this.ChMgrService.getPowerState$().subscribe(s => this.chargeStatus = s);
    // this.ChMgrService.getPowerState$().subscribe(s => console.log('SLY in start-stop =', s));
  }
}
