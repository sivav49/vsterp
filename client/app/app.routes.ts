import {Routes} from '@angular/router';
import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {InvoiceComponent} from './core/invoice/invoice.component';
import {InvoiceEditorComponent} from './core/invoice/invoice-editor/invoice-editor.component';
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {InvoiceListingComponent} from './core/invoice/invoice-listing/invoice-listing.component';
import {PageNotFoundComponent} from './view/page-not-found/page-not-found.component';
import {ClientComponent} from './core/client/client.component';
import {ClientListingComponent} from './core/client/client-listing/client-listing.component';
import {ClientEditorComponent} from './core/client/client-editor/client-editor.component';
import {ClientDetailsComponent} from './core/client/client-details/client-details.component';
import {ClientServiceResolve} from './core/client/client.service';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'clients', pathMatch: 'full'},
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {
        path: 'invoices', component: InvoiceComponent,
        children: [
          {path: '', component: InvoiceListingComponent},
          {path: ':id', component: InvoiceEditorComponent}
        ]
      },
      {path: 'dc', component: DashboardComponent},
      {path: 'jobs', component: DashboardComponent},
      {
        path: 'clients', component: ClientComponent,
        children: [
          {path: '', component: ClientListingComponent},
          {path: 'edit/:id', component: ClientEditorComponent},
          {
            path: ':id',
            component: ClientDetailsComponent,
            resolve: {
              client: ClientServiceResolve
            }
          }
        ]
      },
    ]
  },
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];
