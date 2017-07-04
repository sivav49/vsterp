import {Component, Input, OnInit} from '@angular/core';
import {Invoice, InvoiceItem} from '../invoice.model';
import * as numberToText from 'number2text';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html'
})
export class InvoicePreviewComponent implements OnInit {
  @Input('invoice') invoice: Invoice;

  constructor() {

  }

  ngOnInit() {
  }

  print(invoice: Invoice): void {
    this.invoice = invoice;
    let printContents, popupWin;
    printContents = document.getElementById('invoice-preview').innerHTML;
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
          <link rel="stylesheet" type="text/css" href="/assets/print/invoice-preview.component.css">
          <script>
          function updateSpacingCellHeight() {
            document.getElementsByClassName('spacing-cell')[0].style.height = 878 - document.body.offsetHeight + 'px';
          }
          </script>
        </head>
    <body onload="updateSpacingCellHeight();">${printContents}</body>
      </html>`
    );
    // <body onload="window.print();window.close()">${printContents}</body>
    popupWin.document.close();
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
    let words = numberToText(number, 'indian', true);
    words = words.replace('only', 'Only');
    return words;
  }
}
