import {Routes} from '@angular/router';
import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {InvoiceComponent} from './core/invoice/invoice.component';
import {InvoiceEditorComponent} from './core/invoice/invoice-editor/invoice-editor.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'invoice', pathMatch: 'full'},
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'invoice', component: InvoiceComponent},
      {path: 'invoice-editor', component: InvoiceEditorComponent}
    ]
  }

];
