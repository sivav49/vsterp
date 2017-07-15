import {Component, Input, OnInit} from '@angular/core';
import {amountInWords} from '../../../../shared/number-to-text';
import {InvoiceBos, InvoiceBosItem} from '../invoice-bos.model';

@Component({
  selector: 'app-invoice-bos-print',
  templateUrl: './invoice-bos-print.component.html'
})
export class InvoiceBosPrintComponent implements OnInit {
  public copiesTitles: string[];
  public numberFormat: string;

  @Input('invoice') invoice: InvoiceBos;
  @Input('copies') set copies (value: number) {
    if (value === 2) {
      this.copiesTitles = ['Original for Recipient', 'Duplicate for Supplier'];
    } else if (value === 3) {
      this.copiesTitles = ['Original for Recipient', 'Duplicate for Transporter', 'Triplicate for Supplier'];
    }
    // this.copiesTitles = ['Original for Recipient'];
  }
  @Input('fullRounding') set fullRounding(value: boolean) {
    this.numberFormat = value ? '1.0-0' : '1.2-2';
  }

  constructor() { }

  ngOnInit() {
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('invoice-bos-print').innerHTML;
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
            var page = document.getElementsByClassName('invoice-bos-page');
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
    s = 'VST/BS-' + s.substr(s.length - size);
    return s;
  }

  getTitlePart(invoiceItem: InvoiceBosItem) {
    return invoiceItem.description.split('\n', 1)[0];
  }

  getDescriptionPart(invoiceItem: InvoiceBosItem) {
    const description = invoiceItem.description.split('\n');
    description.shift();
    return description.join('\n');
  }

  getNumberText(number) {
    return amountInWords(number);
  }
}
