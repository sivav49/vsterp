import {Component, Input, OnInit} from '@angular/core';
import {InvoiceGst, InvoiceGstItem} from '../invoice-gst.model';
import * as numberToText from 'number2text';

@Component({
  selector: 'app-invoice-gst-print',
  templateUrl: './invoice-gst-print.component.html'
})
export class InvoiceGstPrintComponent implements OnInit {
  @Input('invoice') invoice: InvoiceGst;
  @Input('copies') copies: Array<string>;

  constructor() {

  }

  ngOnInit() {
  }

  print(invoice: InvoiceGst): void {
    this.invoice = invoice;
    let printContents, popupWin;
    printContents = document.getElementById('invoice-gst-print').innerHTML;
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
            var page = document.getElementsByClassName('invoice-gst-page');
            for(var i=0; i<page.length; i++) {
              // Height of spacing cell = Whole body height(880) - content height
              spacingCell[i].style.height = 880 - page[i].offsetHeight +'px';
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

  formatBillNumber(num) {
    const size = 4;
    let s = '00000000' + num;
    s = 'VST/TI-' + s.substr(s.length - size);
    return s;
  }

  getTitlePart(invoiceItem: InvoiceGstItem) {
    return invoiceItem.description.split('\n', 1)[0];
  }

  getDescriptionPart(invoiceItem: InvoiceGstItem) {
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
