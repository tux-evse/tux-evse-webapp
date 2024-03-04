import { Component, OnInit } from '@angular/core';
import { ChMgrService, ePowerRequest } from '../@core/services/charging-manager-service';

@Component({
  selector: 'app-borne-information',
  templateUrl: './borne-information.component.html',
  styleUrls: ['./borne-information.component.scss']
})
export class BorneInformationComponent implements OnInit {
  stationStatus: ePowerRequest = ePowerRequest.Unknown;

  stationText = new Map<ePowerRequest, string>([
    [ePowerRequest.Charging, "<span class='charging'>Charging</span>"],
    [ePowerRequest.Start, "<span class='available'>Available</span>"],
    [ePowerRequest.Stop, "<span class='out-of-order'>Out of</br>order</span>"],
    [ePowerRequest.Idle, "<span class='intermediate'>Idle</span>"],
    [ePowerRequest.Unknown, "<span class='error'>Unknown</span>"]
  ])

  classMappings = new Map<ePowerRequest, string>([
    [ePowerRequest.Charging, 'charging'],
    [ePowerRequest.Start, 'available'],
    [ePowerRequest.Stop, 'out-of-order'],
    [ePowerRequest.Idle, 'intermediate'],
    [ePowerRequest.Unknown, 'out-of-order']
  ])

  constructor(
    private ChMgrService: ChMgrService,
  ) { }

  ngOnInit(): void {
    this.ChMgrService.getPowerState$().subscribe(s => this.stationStatus = s);
    console.log(this.stationText.get(this.stationStatus));
  }
}