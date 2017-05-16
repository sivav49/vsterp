import {Routes} from '@angular/router';
import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {InvoiceComponent} from './core/invoice/invoice.component';
import {InvoiceEditorComponent} from './core/invoice/invoice-editor/invoice-editor.component';
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {InvoiceListingComponent} from './core/invoice/invoice-listing/invoice-listing.component';
import {PageNotFoundComponent} from './view/page-not-found/page-not-found.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'invoice', pathMatch: 'full'},
  {path: '', component: BasicLayoutComponent, children: [
    {path: 'invoice', component: InvoiceComponent, children: [
      {path: '', component: InvoiceListingComponent},
      {path: ':id', component: InvoiceEditorComponent}
    ]},
    {path: 'dc', component: DashboardComponent},
    {path: 'jobs', component: DashboardComponent},
  ]},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];
