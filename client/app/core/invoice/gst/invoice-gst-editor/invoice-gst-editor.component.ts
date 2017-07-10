import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

import {CustomValidators} from '../../../../shared/CustomValidators';

import {InvoiceGst} from '../invoice-gst.model';
import {InvoiceGstService} from '../invoice-gst.service';
import {InvoiceGstPrintComponent} from '../invoice-gst-print/invoice-gst-print.component';

enum EditorMode {
  None,
  Create,
  View,
  Edit
}

@Component({
  selector: 'app-invoice-gst-editor',
  templateUrl: './invoice-gst-editor.component.html',
  styleUrls: ['./invoice-gst-editor.component.scss']
})
export class InvoiceGstEditorComponent implements OnInit {
  @ViewChild('previewtax') preview: InvoiceGstPrintComponent;

  private mode = EditorMode.None;

  public copies = 2;
  public invoiceForm: FormGroup;

  constructor(public invoiceService: InvoiceGstService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.data
      .subscribe(
        data => {
          this.mode = data.mode;
          this.invoiceService.active = undefined;
          if (this.mode === EditorMode.Edit || this.mode === EditorMode.View) {
            this.setInvoiceForm(data.invoice);
            this.invoiceService.active = data.invoice;
          }
        }
      );
  }

  onSubmit() {
    let serviceCall: Observable<InvoiceGst>;
    const invoice = InvoiceGst.convertFromFormGroup(this.invoiceForm);
    if (this.mode === EditorMode.Create) {
      serviceCall = this.invoiceService.create(invoice);
    } else if (this.mode === EditorMode.Edit) {
      serviceCall = this.invoiceService.update(this.invoiceService.active._id, invoice);
    }
    serviceCall.subscribe(
      (data) => {
        this.invoiceForm.reset();
        this.setInvoiceForm(data);
      }
    );
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      _id: ['', [Validators.required]],
      date: ['', [Validators.required, CustomValidators.date]],
      recipientName: '',
      recipientAddress: '',
      recipientState: '',
      recipientStateCode: '',
      recipientGSTIN: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeState: '',
      consigneeStateCode: '',
      consigneeGSTIN: '',
      items: this.fb.array([]),
      amount: '',
      totalGSTValue: '',
      grandTotal: '',
      fullRounding: ''
    });
    this.onAddInvoiceItem(0);
  }

  private createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      hsn: item.hsn || '',
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      amount: 0,
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      igst: item.igst || 0,
      itemTax: 0
    });

    itemFG.get('quantity').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('unitPrice').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('cgst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('sgst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('igst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );

    return itemFG;
  }

  private setInvoiceForm(invoice: InvoiceGst) {
    const invoiceItemFGs = invoice.items.map((item) => this.createItemFormGroup(item));
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('items', invoiceItemFormArray);

    this.invoiceForm.patchValue({
      _id: invoice._id,
      date: moment(invoice.date).format('YYYY-MM-DD'),
      recipientName: invoice.recipientName,
      recipientAddress: invoice.recipientAddress,
      recipientState: invoice.recipientState,
      recipientStateCode: invoice.recipientStateCode,
      recipientGSTIN: invoice.recipientGSTIN,
      consigneeName: invoice.consigneeName,
      consigneeAddress: invoice.consigneeAddress,
      consigneeState: invoice.consigneeState,
      consigneeStateCode: invoice.consigneeStateCode,
      consigneeGSTIN: invoice.consigneeGSTIN,
      amount: 0,
      totalGSTValue: 0,
      grandTotal: 0
    });

    this.updateComputedValues();
    if (this.mode === EditorMode.View) {
      this.invoiceForm.disable();
    }
  }

  private updateComputedValues() {
    const invoice = InvoiceGst.convertFromFormGroup(this.invoiceForm);

    const itemFGs = this.invoiceForm.get('items') as FormArray;
    itemFGs.controls.forEach((item, index) => {
      const invItem = invoice.items[index];
      if (invItem) {
        item.get('amount').setValue(invItem.amount);
        item.get('itemTax').setValue(invItem.itemTax);
      }
    });

    this.invoiceForm.get('amount').setValue(invoice.amount);
    this.invoiceForm.get('totalGSTValue').setValue(invoice.totalGSTValue);
    this.invoiceForm.get('grandTotal').setValue(invoice.grandTotal);
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
    this.router.navigate(['invoice-gst']);
  }

  nextInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id + 1);
  }

  previousInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id - 1);
  }

  onPrint() {
    if (this.preview) {
      this.preview.print();
    }
  }

  private navigateToInvoice(id: number): void {
    if (this.invoiceForm.dirty) {
      alert('unsaved changes');
    } else {
      this.router.navigate(['../', id], {relativeTo: this.activatedRoute});
    }
  }
}
