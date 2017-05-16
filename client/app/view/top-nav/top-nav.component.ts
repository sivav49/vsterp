import {Component, OnInit} from '@angular/core';
import {smoothlyMenu} from '../../app.helpers';

declare const jQuery: any;

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  toggleNavigation(): void {
    jQuery('body').toggleClass('mini-navbar');
    smoothlyMenu();
  }

}
