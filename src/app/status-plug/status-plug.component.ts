import { Component } from '@angular/core';

@Component({
  selector: 'app-status-plug',
  templateUrl: './status-plug.component.html',
  styleUrls: ['./status-plug.component.scss']
})
export class StatusPlugComponent {
  selectedCase: number = 1; // Change this variable to select the case

  cases: { [key: number]: string } = {
    1: "<span class='intermediate'>Disconnected</span>",
    2: "<span class='on'>Connected</span></br><span class='intermediate'>Unlocked</span>",
    3: "<span class='on'>Connected</br>Locked</span>",
    4: "<span class='error'>Error</span>",
    5: "<span class='error'>Unknow</span>"
  };

  classMappings: {[key: number]: string} = {
    1: 'intermediate',
    2: 'intermediate',
    3: 'on',
    4: 'error',
    5: 'error'
  };
}
