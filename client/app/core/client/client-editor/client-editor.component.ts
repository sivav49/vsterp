import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Client} from '../client.model';
import {ClientService} from '../client.service';
import {Observable} from 'rxjs/Observable';


enum EditorMode {
  None,
  Create,
  Edit
}

@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements OnInit {

  private editorMode = EditorMode.None;

  public clientForm: FormGroup;


  private static getEditorMode(url) {
    let editorMode = EditorMode.None;
    if (url) {
      const urlSegment = url.pop();
      const path = urlSegment.path;
      if (path === 'create') {
        editorMode = EditorMode.Create;
      } else if (path === 'edit') {
        editorMode = EditorMode.Edit;
      }
    }
    return editorMode;
  }

  constructor(private clientService: ClientService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.url
      .subscribe(
        (url) => {
          this.editorMode = ClientEditorComponent.getEditorMode(url);
          if (this.editorMode === EditorMode.Edit) {
            this.activatedRoute.data
              .subscribe(
                (data: { client: Client }) => {
                  this.setForm(data.client);
                  this.clientService.activeClient = data.client;
                  this.clientForm.get('nickName').disable();
                },
                error => {
                  if (error.status === 404) {
                    this.router.navigate(['404']);
                  }
                }
              );
          }
        }
      );
  }

  private createForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      nickName: ['', Validators.required],
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
      name: client.name,
      nickName: client.nickName,
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

  onSubmit() {
    let serviceCall: Observable<Client>;
    if (this.editorMode === EditorMode.Create) {
      serviceCall = this.clientService.create(this.clientForm.value);

    } else if (this.editorMode === EditorMode.Edit) {
      serviceCall = this.clientService.update(this.clientService.activeClient._id, this.clientForm.value);
    }
    serviceCall.subscribe(
      () => {
        this.navigateList();
      }
    );
  }

  navigateList() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}
