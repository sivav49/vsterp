import {Component, OnInit} from '@angular/core';
import {Client} from '../client.model';
import {ClientService} from '../client.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrls: ['./client-listing.component.scss']
})
export class ClientListingComponent implements OnInit {

  public clientList: Client[];
  public activeClient: Client;
  public errorMessage: any;

  constructor(private clientService: ClientService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.clientService.getAll()
      .subscribe(
        (data) => {
          this.clientList = data;
          this.activeClient = this.clientList[0];
        },
        error => this.errorMessage = <any>error
      );
  }

  navigateView() {
    this.router.navigate([this.activeClient._id], {relativeTo: this.activatedRoute});
  }

  navigateEdit() {
    this.router.navigate(['edit', this.activeClient._id], {relativeTo: this.activatedRoute});
  }

}
