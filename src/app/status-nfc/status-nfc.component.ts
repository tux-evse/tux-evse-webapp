import { Component, OnInit } from '@angular/core';
import { ChMgrService, eAuthMsg } from '../@core/services/charging-manager-service';

@Component({
  selector: 'app-status-nfc',
  templateUrl: './status-nfc.component.html',
  styleUrls: ['./status-nfc.component.scss']
})

export class StatusNfcComponent implements OnInit {
  // selectedCase: number = 3; // Change this variable to select the case

  // cases: { [key: number]: string } = {
  //   1: "<span class=''>Please place your badge</br>in the NFC area below</span>",
  //   2: "<span class='on'><b>Badge accepted</b></span>",
  //   3: "<span class='error'><b>Badge unknown</b></span>"
  // };

  nfcStatus: eAuthMsg = eAuthMsg.Unknown; // Change this variable to select the case

    nfcText = new Map<eAuthMsg, string>([
        [eAuthMsg.Done, "<span class='on'>Done</span>"],
        [eAuthMsg.Fail, "<span class='error'>Fail</span>"],
        [eAuthMsg.Pending, "<span class='intermediate'>Pending"],
        [eAuthMsg.Idle, "<span class='idle'>Idle</span>"],
        [eAuthMsg.Unknown, "<span class='error'>Unknown</span>"]
    ]);

    classMappings = new Map<eAuthMsg, string>([
        [eAuthMsg.Done, 'on'],
        [eAuthMsg.Fail, 'error'],
        [eAuthMsg.Pending, 'intermediate'],
        [eAuthMsg.Idle, 'idle'],
        [eAuthMsg.Unknown, 'error']
    ]);

    constructor(
        private ChMgrService: ChMgrService,
    ) {
    }

    ngOnInit() {
        this.ChMgrService.getAuthState$().subscribe(s => this.nfcStatus = s);

        this.ChMgrService.getAuthState$().subscribe(s => console.log('SEB in nfc state component: state=', s));
    }
}
