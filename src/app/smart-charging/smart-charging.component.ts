import { Component } from '@angular/core';

@Component({
  selector: 'app-smart-charging',
  templateUrl: './smart-charging.component.html',
  styleUrls: ['./smart-charging.component.scss']
})
export class SmartChargingComponent {

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
}
