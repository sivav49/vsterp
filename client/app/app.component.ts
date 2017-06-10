import {Component, ViewContainerRef} from '@angular/core';

import {ToastsManager} from 'ng2-toastr';
import { Overlay } from 'angular2-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private toastr: ToastsManager, private overlay: Overlay, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.overlay.defaultViewContainer = vcr;
  }
}
