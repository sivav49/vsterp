import {Routes} from '@angular/router';

import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {PageNotFoundComponent} from './view/page-not-found/page-not-found.component';

import {ClientComponent} from './core/client/client.component';
import {ClientListingComponent} from './core/client/client-listing/client-listing.component';
import {ClientEditorComponent} from './core/client/client-editor/client-editor.component';
import {ClientDetailsComponent} from './core/client/client-details/client-details.component';
import {ClientGetAllResolve, ClientGetResolve} from './core/client/client.service';

import {InvoiceVatComponent} from './core/invoice/vat/invoice-vat.component';
import {InvoiceVatListComponent} from './core/invoice/vat/invoice-vat-list/invoice-vat-list.component';
import {InvoiceVatEditorComponent} from './core/invoice/vat/invoice-vat-editor/invoice-vat-editor.component';
import {InvoiceVatGetResolve} from './core/invoice/vat/invoice-vat.service';

import {InvoiceGstListComponent} from './core/invoice/gst/invoice-gst-list/invoice-gst-list.component';
import {InvoiceGstEditorComponent} from './core/invoice/gst/invoice-gst-editor/invoice-gst-editor.component';
import {InvoiceGstComponent} from './core/invoice/gst/invoice-gst.component';
import {InvoiceGstGetResolve} from './core/invoice/gst/invoice-gst.service';
import {EditorMode} from './core/invoice/invoice-editor';
import {InvoiceBosComponent} from './core/invoice/bos/invoice-bos.component';
import {InvoiceBosListComponent} from './core/invoice/bos/invoice-bos-list/invoice-bos-list.component';
import {InvoiceBosEditorComponent} from './core/invoice/bos/invoice-bos-editor/invoice-bos-editor.component';
import {InvoiceBosGetResolve} from './core/invoice/bos/invoice-bos.service';

export const ROUTES: Routes = [{
  path: '', redirectTo: 'invoice-gst', pathMatch: 'full'
}, {
  path: '', component: BasicLayoutComponent,
  children: [
    {
      path: 'invoice-vat', component: InvoiceVatComponent,
      children: [{
        path: '', component: InvoiceVatListComponent
      }, {
        path: 'create',
        component: InvoiceVatEditorComponent,
        data: {
          mode: EditorMode.Create
        }
      }, {
        path: ':id',
        component: InvoiceVatEditorComponent,
        data: {
          mode: EditorMode.View,
        },
        resolve: {
          invoice: InvoiceVatGetResolve
        }
      }, {
        path: ':id/edit',
        component: InvoiceVatEditorComponent,
        data: {
          mode: EditorMode.Edit
        },
        resolve: {
          invoice: InvoiceVatGetResolve
        }
      }
      ]
    },
    {
      path: 'invoice-gst', component: InvoiceGstComponent,
      children: [{
        path: '', component: InvoiceGstListComponent
      }, {
        path: 'create',
        component: InvoiceGstEditorComponent,
        data: {
          mode: EditorMode.Create
        },
        resolve: {
          clients: ClientGetAllResolve
        }
      }, {
        path: ':id',
        component: InvoiceGstEditorComponent,
        data: {
          mode: EditorMode.View,
        },
        resolve: {
          invoice: InvoiceGstGetResolve,
          clients: ClientGetAllResolve
        }
      }, {
        path: ':id/edit',
        component: InvoiceGstEditorComponent,
        data: {
          mode: EditorMode.Edit
        },
        resolve: {
          invoice: InvoiceGstGetResolve,
          clients: ClientGetAllResolve
        }
      }
      ]
    },
    {
      path: 'invoice-bos', component: InvoiceBosComponent,
      children: [{
        path: '', component: InvoiceBosListComponent
      }, {
        path: 'create',
        component: InvoiceBosEditorComponent,
        data: {
          mode: EditorMode.Create
        },
        resolve: {
          clients: ClientGetAllResolve
        }
      }, {
        path: ':id',
        component: InvoiceBosEditorComponent,
        data: {
          mode: EditorMode.View,
        },
        resolve: {
          invoice: InvoiceBosGetResolve,
          clients: ClientGetAllResolve
        }
      }, {
        path: ':id/edit',
        component: InvoiceBosEditorComponent,
        data: {
          mode: EditorMode.Edit
        },
        resolve: {
          invoice: InvoiceBosGetResolve,
          clients: ClientGetAllResolve
        }
      }
      ]
    },
    {
      path: 'dc', component: DashboardComponent
    }, {
      path: 'jobs', component: DashboardComponent
    }, {
      path: 'clients', component: ClientComponent,
      children: [
        {
          path: '',
          component: ClientListingComponent,
        }, {
          path: 'create',
          component: ClientEditorComponent
        }, {
          path: ':id',
          component: ClientDetailsComponent,
          resolve: {
            client: ClientGetResolve
          }
        }, {
          path: ':id/edit',
          component: ClientEditorComponent,
          resolve: {
            client: ClientGetResolve
          }
        },
      ]
    },
  ]
},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];
