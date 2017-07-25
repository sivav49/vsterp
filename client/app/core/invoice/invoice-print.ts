import {Input} from '@angular/core';
import {amountInWords} from '../../shared/number-to-text';
import {Invoice, InvoiceItem} from './invoice.model';

export class InvoicePrint<T extends Invoice> {

  protected rootId = '';
  protected pageId = '';
  protected billPrefix = '';

  public copiesTitles: string[];
  public numberFormat: string;

  @Input('invoice') invoice: T;

  @Input('copies') set copies(value: number) {
    if (value === 2) {
      this.copiesTitles = ['Original for Recipient', 'Duplicate for Supplier'];
    } else if (value === 3) {
      this.copiesTitles = ['Original for Recipient', 'Duplicate for Transporter', 'Triplicate for Supplier'];
    }
  }

  @Input('fullRounding') set fullRounding(value: boolean) {
    this.numberFormat = value ? '1.0-0' : '1.2-2';
  }

  constructor() {

  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById(this.rootId).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Print tab</title>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="/assets/print/bootstrap.css">
          <link rel="stylesheet" type="text/css" href="/assets/print/print.css">
          <link rel="stylesheet" type="text/css" href="/assets/print/invoice-preview-tax.component.css">
          <script>
          function updateSpacingCellHeight() {
            var spacingCell = document.getElementsByClassName('spacing-cell');
            var page = document.getElementsByClassName('${this.pageId}');
            for(var i=0; i<page.length; i++) {
              // Height of spacing cell = Whole body height(916) - content height
              spacingCell[i].style.height = 916 - page[i].offsetHeight +'px';
            }
          }
          </script>
        </head>
    <body onload="updateSpacingCellHeight();">${printContents}</body>
      </html>`
    );
    // <body onload="window.print();window.close()">${printContents}</body>
    popupWin.document.close();
  }

  formatBillNumber() {
    return this.billPrefix + this.invoice.getBillNumberText();
  }

  getTitlePart(invoiceItem: InvoiceItem) {
    return invoiceItem.description.split('\n', 1)[0];
  }

  getDescriptionPart(invoiceItem: InvoiceItem) {
    const description = invoiceItem.description.split('\n');
    description.shift();
    return description.join('\n');
  }

  getNumberText(number) {
    return amountInWords(number);
  }
}
