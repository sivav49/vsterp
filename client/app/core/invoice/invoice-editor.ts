import {Observable} from 'rxjs/Observable';

import {Invoice} from './invoice.model';
import {Client} from '../client/client.model';
import {InvoiceService} from './invoice-service';
import {ClientService} from '../client/client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OnInit} from '@angular/core';

export enum EditorMode {
  None,
  Create,
  View,
  Edit
}

export class InvoiceEditor<T extends Invoice>  implements OnInit {

  protected basePath = '';
  protected mode = EditorMode.None;

  public copies = 3;
  public invoiceForm: FormGroup;
  public clientList: Client[];

  constructor(public invoiceService: InvoiceService<T>,
              public clientService: ClientService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              protected fb: FormBuilder) {

  }

  ngOnInit() {
    this.activatedRoute.data
      .subscribe(
        data => {
          this.clientList = data.clients;
          this.reloadForm(data.invoice, data.mode);
        }
      );
  }

  onSubmit(invoice) {
    let serviceCall: Observable<T>;
    if (this.mode === EditorMode.Create) {
      serviceCall = this.invoiceService.create(invoice);
      serviceCall.subscribe(
        (data: T) => {
          this.router.navigate([this.basePath, data._id, 'edit']).then();
        }
      );
    } else if (this.mode === EditorMode.Edit) {
      serviceCall = this.invoiceService.update(this.invoiceService.active._id, invoice);
      serviceCall.subscribe(
        (data: T) => {
          this.reloadForm(data, this.mode);
        }
      );
    }
  }

  protected  createForm(invoice?: T) {

  }

  protected createItemFormGroup(item?) {
    return undefined;
  }

  protected updateComputedValues() {
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  };

  onAddInvoiceItem(i: number): void {
    this.items.insert(i + 1, this.createItemFormGroup());
  }

  onDuplicateInvoiceItem(i: number): void {
    const item = this.items.at(i).value;
    this.items.insert(i + 1, this.createItemFormGroup(item));
    this.updateComputedValues();
  }

  onDeleteInvoiceItem(i: number): void {
    this.items.removeAt(i);
    if (this.items.length === 0) {
      this.onAddInvoiceItem(0);
    }
    this.updateComputedValues();
  }

  navigateList() {
    this.router.navigate(['invoice-gst']).then();
  }

  nextInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id + 1);
  }

  previousInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id - 1);
  }

  private navigateToInvoice(id: number): void {
    if (this.invoiceForm.dirty) {
      alert('unsaved changes');
    } else {
      this.router.navigate(['../', id], {relativeTo: this.activatedRoute}).then();
    }
  }

  private reloadForm(invoice, mode) {
    this.mode = mode;
    this.invoiceService.active = undefined;
    if (this.mode === EditorMode.Edit || this.mode === EditorMode.View) {
      this.createForm(invoice);
      this.invoiceService.active = invoice;
    } else {
      this.createForm();
    }
  }
}
