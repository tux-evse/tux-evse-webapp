import { Component } from '@angular/core';
import { ChMgrService, ePlugState } from '../@core/services/charging-manager-service';

@Component({
    selector: 'app-status-plug',
    templateUrl: './status-plug.component.html',
    styleUrls: ['./status-plug.component.scss']
})
export class StatusPlugComponent {
    plugStatus: ePlugState = ePlugState.Unknown; // Change this variable to select the case

    plugText = new Map<ePlugState, string>([
        [ePlugState.PlugOut, "<span class='intermediate'>Disconnected</span>"],
        [ePlugState.PlugIn, "<span class='on'>Connected</span></br><span] class='intermediate'>Unlocked</span>"],
        [ePlugState.Lock, "<span class='on'>Connected</br>Locked</span>"],
        [ePlugState.Error, "<span class='error'>Error</span>"],
        [ePlugState.Unknown, "<span class='error'>Unknown</span>"]
    ]);

    classMappings = new Map<ePlugState, string>([
        [ePlugState.PlugOut, 'intermediate'],
        [ePlugState.PlugIn, 'intermediate'],
        [ePlugState.Lock, 'on'],
        [ePlugState.Error, 'error'],
        [ePlugState.Unknown, 'error']
    ]);

    constructor(
        private ChMgrService: ChMgrService,
    ) {
    }

    ngOnInit() {
        this.ChMgrService.getPlugState$().subscribe(s => this.plugStatus = s);

        this.ChMgrService.getPlugState$().subscribe(s => console.log('SEB in plug state component: state=', s));
    }

}
