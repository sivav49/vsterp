import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Client} from '../client.model';
import {ClientService} from '../client.service';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrls: ['./client-listing.component.scss']
})
export class ClientListingComponent implements OnInit {

  public loaded = false;
  public clientList: Client[];
  public errorMessage: any;

  constructor(public clientService: ClientService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reload();
  }

  navigateCreate() {
    this.router.navigate(['create'], {relativeTo: this.activatedRoute});
  }

  navigateView() {
    this.router.navigate([this.clientService.activeClient._id], {relativeTo: this.activatedRoute});
  }

  navigateEdit() {
    this.router.navigate([this.clientService.activeClient._id, 'edit'], {relativeTo: this.activatedRoute});
  }

  deleteClient() {
    this.clientService.removeConfirmation(this.clientService.activeClient._id)
      .subscribe(
        (result) => {
          if (result.isOkay()) {
            this.reload();
          }
        }
      );
  }

  private reload() {
    this.loaded = false;
    this.clientService.getAll()
      .subscribe(
        (clients) => {
          this.clientList = clients;
          if (!this.clientService.activeClient || this.clientList.findIndex(x => x._id === this.clientService.activeClient._id) === -1) {
            this.clientService.activeClient = this.clientList[0];
          }
          this.loaded = true;
        },
        error => this.errorMessage = <any>error
      );
  }
}
