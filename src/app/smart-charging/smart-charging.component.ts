import { Component } from '@angular/core';

@Component({
  selector: 'app-smart-charging',
  templateUrl: './smart-charging.component.html',
  styleUrls: ['./smart-charging.component.scss']
})
export class SmartChargingComponent {
  ocppChecked: boolean = true;
  iso15118Checked: boolean = false;
  pncChecked: boolean = false;
  v2gChecked: boolean = false;
  badgeChecked: boolean = true;
}

