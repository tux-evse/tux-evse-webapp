import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  currentTime: string = '';

  ngOnInit() {
    interval(1000).subscribe(() => {
      this.updateCurrentTime();
    });
  }

  updateCurrentTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }
}