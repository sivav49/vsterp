import {Component, Input, OnInit} from '@angular/core';
import {InvoiceVat, InvoiceVatItem} from '../invoice-vat.model';
import {amountInWords} from '../../../../shared/number-to-text';

@Component({
  selector: 'app-invoice-vat-print',
  templateUrl: './invoice-vat-print.component.html'
})
export class InvoiceVatPrintComponent implements OnInit {
  @Input('invoice') invoice: InvoiceVat;

  constructor() {

  }

  ngOnInit() {
  }

  print(invoice: InvoiceVat): void {
    this.invoice = invoice;
    let printContents, popupWin;
    printContents = document.getElementById('invoice-preview-tax').innerHTML;
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
            // Height of spacing cell = Whole body height(861) - content height 
            document.getElementsByClassName('spacing-cell')[0].style.height = 861 - document.body.offsetHeight + 'px';
          }
          </script>
        </head>
    <body onload="updateSpacingCellHeight();">${printContents}</body>
      </html>`
    );
    // <body onload="window.print();window.close()">${printContents}</body>
    popupWin.document.close();
  }

  getTitlePart(invoiceItem: InvoiceVatItem) {
    return invoiceItem.description.split('\n', 1)[0];
  }

  getDescriptionPart(invoiceItem: InvoiceVatItem) {
    const description = invoiceItem.description.split('\n');
    description.shift();
    return description.join('\n');
  }

  getNumberText(number) {
    return amountInWords(number);
  }
}
