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
      name: 'OCPP', checked: false
    },
    {
      name: 'ISO 15118', checked: false
    },
    {
      name: 'PnC', checked: false
    },
    {
      name: 'V2G', checked: false
    },
    {
      name: 'IEC', checked: false
    }
  ];

  constructor(private chMgrService: ChMgrService) {
  //   this.chMgrService.getIsoState$().subscribe(state => {
  //     this.smartStatus = state;
  //   });
  }

  ngOnInit() {
    this.chMgrService.getIsoState$().subscribe(state => {
      this.smartStatus = state;
    });

    this.chMgrService.getIsoState$().subscribe(state => console.log('SLY in smart state component: state=', state));
  }

  changeSmartList(smart: string) {
    this.smartList.forEach(s => {
      if (s.name === smart) {
        s.checked = !s.checked;
      }
    });
  }
}
