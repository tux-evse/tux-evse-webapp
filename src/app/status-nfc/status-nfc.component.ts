import { Component } from '@angular/core';

@Component({
  selector: 'app-status-nfc',
  templateUrl: './status-nfc.component.html',
  styleUrls: ['./status-nfc.component.scss']
})
export class StatusNfcComponent {
  selectedCase: number = 3; // Change this variable to select the case

  cases: { [key: number]: string } = {
    1: "<span class=''>Please place your badge</br>in the NFC area below</span>",
    2: "<span class='on'><b>Badge accepted</b></span>",
    3: "<span class='error'><b>Badge unknown</b></span>"
  };
}
