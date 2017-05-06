import {Component, HostListener, OnInit} from '@angular/core';
import {detectBody} from '../../app.helpers';

@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.scss']
})
export class BasicLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    detectBody();
  }

  @HostListener('window:resize')
  onResize() {
    detectBody();
  }
}
