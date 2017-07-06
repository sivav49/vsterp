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
          if (this.mode === EditorMode.Edit || this.mode === EditorMode.View) {
            this.setInvoiceForm(data.invoice);
            this.invoiceService.active = data.invoice;
          }
        }
      );
  }

  onSubmit() {
    let serviceCall: Observable<InvoiceGst>;
    const invoice = this.invoiceForm.value;
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
      totalCGSTValue: '',
      totalSGSTValue: '',
      totalIGSTValue: '',
      totalGSTValue: '',
      grandTotal: ''
    });
    this.onAddInvoiceItem(0);
  }

  private createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      hsn: item.hsn || '',
      quantity: item.quantity || '',
      unitPrice: item.unitPrice || '',
      amount: 0,
      cgst: item.cgst || '',
      cgstValue: 0,
      sgst: item.sgst || '',
      sgstValue: 0,
      igst: item.igst || '',
      igstValue: 0,
      itemTax: 0,
    });

    if (this.mode === EditorMode.View) {
      itemFG.disable();
    } else {
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
    }
    return itemFG;
  }

  private setInvoiceForm(invoice: InvoiceGst) {
    const invoiceItemFGs = invoice.items.map(() => this.createItemFormGroup());
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('items', invoiceItemFormArray);

    this.invoiceForm.setValue({
      _id: invoice._id,
      date: moment(invoice.date).format('DD-MM-YYYY'),
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
      items: invoice.items.map(item => {
        return {
          description: item.description || '',
          hsn: item.hsn || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: 0,
          cgst: item.cgst,
          cgstValue: 0,
          sgst: item.sgst,
          sgstValue: 0,
          igst: item.igst,
          igstValue: 0,
          itemTax: 0
        };
      }),
      amount: 0,
      totalCGSTValue: 0,
      totalSGSTValue: 0,
      totalIGSTValue: 0,
      totalGSTValue: 0,
      grandTotal: 0
    });

    this.updateComputedValues();
    if (this.mode === EditorMode.View) {
      this.invoiceForm.disable();
    }
  }

  private updateComputedValues() {
    const itemFGs = this.invoiceForm.get('items') as FormArray;
    let totalAmount = 0;
    let totalCGSTValue = 0;
    let totalSGSTValue = 0;
    let totalIGSTValue = 0;
    let totalGSTValue = 0;
    for (const item of itemFGs.controls) {
      const quantity = item.get('quantity').value;
      const unitPrice = item.get('unitPrice').value;
      const itemAmount = quantity * unitPrice;
      const cgst = item.get('cgst').value;
      const cgstValue = (itemAmount * cgst / 100);
      const sgst = item.get('sgst').value;
      const sgstValue = (itemAmount * sgst / 100);
      const igst = item.get('igst').value;
      const igstValue = (itemAmount * igst / 100);
      const itemTax = cgstValue + sgstValue + igstValue;

      item.get('amount').setValue(itemAmount);
      item.get('cgstValue').setValue(cgstValue);
      item.get('sgstValue').setValue(sgstValue);
      item.get('igstValue').setValue(igstValue);
      item.get('itemTax').setValue(itemTax);

      totalAmount += itemAmount;
      totalCGSTValue += cgstValue;
      totalSGSTValue += sgstValue;
      totalIGSTValue += igstValue;
      totalGSTValue += itemTax;

    }
    const grandTotal = totalAmount + totalGSTValue;

    this.invoiceForm.get('amount').setValue(totalAmount);
    this.invoiceForm.get('totalCGSTValue').setValue(totalCGSTValue);
    this.invoiceForm.get('totalSGSTValue').setValue(totalSGSTValue);
    this.invoiceForm.get('totalIGSTValue').setValue(totalIGSTValue);
    this.invoiceForm.get('totalGSTValue').setValue(totalGSTValue);
    this.invoiceForm.get('grandTotal').setValue(grandTotal);
  }

  // private updateAllAmount() {
  //   const itemFGs = this.invoiceForm.get('items') as FormArray;
  //   for (const item of itemFGs.controls) {
  //     this.updateItemAmount(item);
  //   }
  //   this.updateInvoiceAmount();
  // }
  //
  // private updateItemAmount(itemFormGroup: AbstractControl) {
  //   const quantity = itemFormGroup.get('quantity').value;
  //   const unitPrice = itemFormGroup.get('unitPrice').value;
  //   const itemAmount = quantity * unitPrice;
  //   itemFormGroup.get('amount').setValue(itemAmount);
  // }
  //
  // private updateInvoiceAmount() {
  //   const itemFGs = this.invoiceForm.get('items') as FormArray;
  //   let amount = 0;
  //   for (const item of itemFGs.controls) {
  //     const qty = item.get('quantity').value;
  //     const rate = item.get('unitPrice').value;
  //     amount += qty * rate;
  //   }
  //   const grandTotal = amount;
  //   this.invoiceForm.get('amount').setValue(amount);
  //   this.invoiceForm.get('grandTotal').setValue(grandTotal);
  // }

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
      this.preview.print(this.invoiceForm.value);
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
