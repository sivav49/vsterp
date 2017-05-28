import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../client.model';

@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements OnInit {

  public clientForm: FormGroup;

  constructor(private clientService: ClientService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params) => {
          this.clientService.getClient(params['id'])
            .subscribe(
              (client) => {
                this.setForm(client);
              },
              error => {
                if (error.status === 404) {
                  this.router.navigate(['404']);
                }
              }
            );
        }
      );
  }

  private createForm() {
    this.clientForm = this.fb.group({
      cName: ['', Validators.required],
      addrl1: ['', Validators.required],
      addrl2: '',
      state: '',
      city: '',
      pincode: '',
      email: '',
      phone: '',
      tin: '',
    });
  }

  private setForm(client: Client) {
    this.clientForm.setValue({
      cName: client.cName,
      addrl1: client.addrl1,
      addrl2: client.addrl2,
      state: client.state,
      city: client.city,
      pincode: client.pincode,
      email: client.email,
      phone: client.phone,
      tin: client.tin,
    });
  }
}
