import {Component, OnInit} from '@angular/core';
import {ClientService} from './client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [ClientService]
})
export class ClientComponent implements OnInit {



  constructor() {
  }

  ngOnInit() {

  }

}
