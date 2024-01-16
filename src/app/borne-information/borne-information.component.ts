import { Component } from '@angular/core';

@Component({
  selector: 'app-borne-information',
  templateUrl: './borne-information.component.html',
  styleUrls: ['./borne-information.component.scss']
})
export class BorneInformationComponent {
  selectedCase: number = 1; // Change this variable to select the case

  cases: { [key: number]: string } = {
    1: "<span class='available'>Available</span>",
    2: "<span class='reserved'>Reserved</span>",
    3: "<span class='pending-autho'>Pending autho</span>",
    4: "<span class='charging'>Charging</span>",
    5: "<span class='completed'>Completed</span>",
    6: "<span class='out-of-order'>Out of</br>order</span>"
  };

  classMappings: {[key: number]: string} = {
    1: 'available',
    2: 'reserved',
    3: 'pending-autho',
    4: 'charging',
    5: 'completed',
    6: 'out-of-order'
  };
}