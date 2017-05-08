import { Component } from '@angular/core';
import {InvoiceService} from './core/invoice/invoice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [InvoiceService]
})
export class AppComponent {
}
