import { Component, OnInit } from '@angular/core';
import { ChMgrService, eIsoState } from '../@core/services/charging-manager-service';

@Component({
  selector: 'app-smart-charging',
  templateUrl: './smart-charging.component.html',
  styleUrls: ['./smart-charging.component.scss']
})
export class SmartChargingComponent {

  smartStatus: eIsoState = eIsoState.Unset;

  smartList = [
    {
      name: 'iso20', checked: false
    },
    {
      name: 'iso2', checked: false
    },
    {
      name: 'iso3', checked: false
    },
    {
      name: 'iec', checked: false
    }
  ];

  constructor(private chMgrService: ChMgrService) {
  }

  ngOnInit() {
    this.chMgrService.getIsoState$().subscribe(state => {
      this.smartStatus = state;
    });
  }
}
