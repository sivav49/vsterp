import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

import {CustomValidators} from '../../../../shared/CustomValidators';

import {InvoiceVat} from '../invoice-vat.model';
import {InvoiceVatService} from '../invoice-vat.service';
import {InvoiceVatPrintComponent} from '../invoice-vat-print/invoice-vat-print.component';

enum EditorMode {
  None,
  Create,
  View,
  Edit
}

const defaultVAT = 5;

@Component({
  selector: 'app-invoice-vat-editor',
  templateUrl: './invoice-vat-editor.component.html',
  styleUrls: ['./invoice-vat-editor.component.scss']
})
export class InvoiceVatEditorComponent implements OnInit {
  @ViewChild('previewtax') preview: InvoiceVatPrintComponent;

  private mode = EditorMode.None;

  public invoiceForm: FormGroup;
  private errorMessage: any;

  constructor(public invoiceService: InvoiceVatService,
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
    let serviceCall: Observable<InvoiceVat>;
    const invoice = this.invoiceForm.value;
    invoice.vatPercent = invoice.isVAT ? defaultVAT : 0;
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

  onPrint() {
    if (this.preview) {
      this.preview.print(this.invoiceForm.value);
    }
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      _id: ['', [Validators.required]],
      dcNo: '',
      date: ['', [Validators.required, CustomValidators.date]],
      clientName: '',
      clientAddress: '',
      clientTIN: '',
      description: '',
      items: this.fb.array([]),
      isVAT: true,
      amount: '',
      vatAmount: '',
      grandTotal: ''
    });
    this.onAddInvoiceItem(0);
    this.invoiceForm.get('isVAT').valueChanges.subscribe(
      () => {
        this.updateInvoiceAmount();
      }
    );
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
    this.updateInvoiceAmount();
  }

  onDeleteInvoiceItem(i: number): void {
    this.items.removeAt(i);
    if (this.items.length === 0) {
      this.onAddInvoiceItem(0);
    }
    this.updateInvoiceAmount();
  }

  navigateList() {
    this.router.navigate(['invoice-vat']);
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
      this.router.navigate(['../', id], {relativeTo: this.activatedRoute});
    }
  }

  private updateAllAmount() {
    const itemFGs = this.invoiceForm.get('items') as FormArray;
    for (const item of itemFGs.controls) {
      this.updateItemAmount(item);
    }
    this.updateInvoiceAmount();
  }

  private updateItemAmount(itemFormGroup: AbstractControl) {
    const quantity = itemFormGroup.get('quantity').value;
    const unitPrice = itemFormGroup.get('unitPrice').value;
    const itemAmount = quantity * unitPrice;
    itemFormGroup.get('amount').setValue(itemAmount);
  }

  private updateInvoiceAmount() {
    const itemFGs = this.invoiceForm.get('items') as FormArray;
    let amount = 0;
    for (const item of itemFGs.controls) {
      const qty = item.get('quantity').value;
      const rate = item.get('unitPrice').value;
      amount += qty * rate;
    }
    const isVAT = this.invoiceForm.get('isVAT').value;
    const vatAmount = amount * (isVAT ? defaultVAT / 100 : 0);
    const grandTotal = amount + vatAmount;
    this.invoiceForm.get('amount').setValue(amount);
    this.invoiceForm.get('vatAmount').setValue(vatAmount);
    this.invoiceForm.get('grandTotal').setValue(grandTotal);
  }

  private createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      quantity: item.quantity || '',
      unitPrice: item.unitPrice || '',
      amount: 0
    });

    this.updateItemAmount(itemFG);

    if (this.mode === EditorMode.View) {
      itemFG.disable();
    } else {
      itemFG.get('quantity').valueChanges.subscribe(
        () => {
          this.updateItemAmount(itemFG);
          this.updateInvoiceAmount();
        }
      );
      itemFG.get('unitPrice').valueChanges.subscribe(
        () => {
          this.updateItemAmount(itemFG);
          this.updateInvoiceAmount();
        }
      );
    }
    return itemFG;
  }

  private setInvoiceForm(invoice: InvoiceVat) {
    const invoiceItemFGs = invoice.items.map(() => this.createItemFormGroup());
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('items', invoiceItemFormArray);

    this.invoiceForm.setValue({
      _id: invoice._id,
      dcNo: invoice.dcNo || '',
      date: moment(invoice.date).format('DD-MM-YYYY'),
      clientName: invoice.clientName,
      clientAddress: invoice.clientAddress || '',
      clientTIN: invoice.clientTIN || '',
      description: invoice.description || '',
      items: invoice.items.map(item => {
        return {
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: 0
        };
      }),
      isVAT: invoice.vatPercent !== 0,
      amount: 0,
      vatAmount: 0,
      grandTotal: 0
    });

    this.updateAllAmount();
    if (this.mode === EditorMode.View) {
      this.invoiceForm.disable();
    }
  }
}
