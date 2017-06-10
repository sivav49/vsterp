import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../client.model';
import {ClientService, ConfirmationResult, PopupResult} from '../client.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  public client: Client;

  constructor(private router: Router,
              private clientService: ClientService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.data
      .subscribe((data: { client: Client }) => {
        this.client = data.client;
        this.clientService.activeClient = this.client;
      });
  }

  navigateList() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  navigateEdit() {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  deleteClient() {
    this.clientService.deleteConfirmation(this.clientService.activeClient._id)
      .subscribe(
        (result: ConfirmationResult<Client>) => {
          if (result.popupResult === PopupResult.Ok) {
            this.navigateList();
          }
        }
      );
  }
}
