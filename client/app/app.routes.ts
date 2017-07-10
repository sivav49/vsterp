import {Routes} from '@angular/router';

import {BasicLayoutComponent} from './view/basic-layout/basic-layout.component';
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {PageNotFoundComponent} from './view/page-not-found/page-not-found.component';

// import {InvoiceComponent} from './core/invoice/invoice.component';
// import {InvoiceEditorComponInvoiceGstServiceent} from './core/invoice/invoice-editor/invoice-editor.component';
// import {InvoiceListingComponent} from './core/invoice/invoice-listing/invoice-listing.component';
// import {InvoiceGetResolve} from './core/invoice/invoice.service';

import {ClientComponent} from './core/client/client.component';
import {ClientListingComponent} from './core/client/client-listing/client-listing.component';
import {ClientEditorComponent} from './core/client/client-editor/client-editor.component';
import {ClientDetailsComponent} from './core/client/client-details/client-details.component';
import {ClientGetResolve} from './core/client/client.service';

import {InvoiceVatComponent} from './core/invoice/vat/invoice-vat.component';
import {InvoiceVatListComponent} from './core/invoice/vat/invoice-vat-list/invoice-vat-list.component';
import {InvoiceVatEditorComponent} from './core/invoice/vat/invoice-vat-editor/invoice-vat-editor.component';
import {InvoiceVatGetResolve} from './core/invoice/vat/invoice-vat.service';

import {InvoiceGstListComponent} from './core/invoice/gst/invoice-gst-list/invoice-gst-list.component';
import {InvoiceGstEditorComponent} from './core/invoice/gst/invoice-gst-editor/invoice-gst-editor.component';
import {InvoiceGstComponent} from './core/invoice/gst/invoice-gst.component';
import {InvoiceGstGetResolve} from './core/invoice/gst/invoice-gst.service';

enum EditorMode {
  None,
  Create,
  View,
  Edit
}

export const ROUTES: Routes = [{
  path: '', redirectTo: 'invoice-gst', pathMatch: 'full'
}, {
  path: '', component: BasicLayoutComponent,
  children: [
    //   {
    //   path: 'invoices', component: InvoiceComponent,
    //   children: [{
    //     path: '', component: InvoiceListingComponent
    //   }, {
    //     path: 'create',
    //     component: InvoiceEditorComponent,
    //     data: {
    //       mode: EditorMode.Create
    //     }
    //   }, {
    //     path: ':id',
    //     component: InvoiceEditorComponent,
    //     data: {
    //       mode: EditorMode.View,
    //     },
    //     resolve: {
    //       invoice: InvoiceGetResolve
    //     }
    //   }, {
    //     path: ':id/edit',
    //     component: InvoiceEditorComponent,
    //     data: {
    //       mode: EditorMode.Edit
    //     },
    //     resolve: {
    //       invoice: InvoiceGetResolve
    //     }
    //   }
    //   ]
    // },
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
        }
      }, {
        path: ':id',
        component: InvoiceGstEditorComponent,
        data: {
          mode: EditorMode.View,
        },
        resolve: {
          invoice: InvoiceGstGetResolve
        }
      }, {
        path: ':id/edit',
        component: InvoiceGstEditorComponent,
        data: {
          mode: EditorMode.Edit
        },
        resolve: {
          invoice: InvoiceGstGetResolve
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
