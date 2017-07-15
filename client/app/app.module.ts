import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastModule } from 'ng2-toastr';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { JobComponent } from './core/job/job.component';
import { DeliveryChallanComponent } from './core/delivery-challan/delivery-challan.component';
import { EstimateComponent } from './core/estimate/estimate.component';
import { BasicLayoutComponent } from './view/basic-layout/basic-layout.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { SideNavComponent } from './view/side-nav/side-nav.component';
import { TopNavComponent } from './view/top-nav/top-nav.component';
import { PageNotFoundComponent } from './view/page-not-found/page-not-found.component';
import { ClientComponent } from './core/client/client.component';
import { ClientEditorComponent } from './core/client/client-editor/client-editor.component';
import { ClientListingComponent } from './core/client/client-listing/client-listing.component';
import { ClientDetailsComponent } from './core/client/client-details/client-details.component';
import { ClientService, ClientGetResolve, ClientGetAllResolve } from './core/client/client.service';
import { PopupService } from './shared/popup.service';
import { InvoiceVatComponent } from './core/invoice/vat/invoice-vat.component';
import { FormattedReadonlyNumberComponent } from './shared/formatted-readonly-number-component';
import { InvoiceService } from './core/invoice/invoice-service';
import { InvoiceVatListComponent } from './core/invoice/vat/invoice-vat-list/invoice-vat-list.component';
import { InvoiceVatEditorComponent } from './core/invoice/vat/invoice-vat-editor/invoice-vat-editor.component';
import { InvoiceVatPrintComponent } from './core/invoice/vat/invoice-vat-print/invoice-vat-print.component';
import { InvoiceVatGetResolve, InvoiceVatService } from './core/invoice/vat/invoice-vat.service';
import { InvoiceGstListComponent } from './core/invoice/gst/invoice-gst-list/invoice-gst-list.component';
import { InvoiceGstComponent } from './core/invoice/gst/invoice-gst.component';
import { InvoiceGstEditorComponent } from './core/invoice/gst/invoice-gst-editor/invoice-gst-editor.component';
import { InvoiceGstPrintComponent } from './core/invoice/gst/invoice-gst-print/invoice-gst-print.component';
import { InvoiceGstGetResolve, InvoiceGstService } from './core/invoice/gst/invoice-gst.service';
import { InvoiceBosComponent } from './core/invoice/bos/invoice-bos.component';
import { InvoiceBosListComponent } from './core/invoice/bos/invoice-bos-list/invoice-bos-list.component';
import { InvoiceBosEditorComponent } from './core/invoice/bos/invoice-bos-editor/invoice-bos-editor.component';
import { InvoiceBosPrintComponent } from './core/invoice/bos/invoice-bos-print/invoice-bos-print.component';
import {InvoiceBosGetResolve, InvoiceBosService} from './core/invoice/bos/invoice-bos.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobComponent,
    DeliveryChallanComponent,
    EstimateComponent,
    BasicLayoutComponent,
    SideNavComponent,
    TopNavComponent,
    PageNotFoundComponent,
    ClientComponent,
    ClientEditorComponent,
    ClientListingComponent,
    ClientDetailsComponent,
    FormattedReadonlyNumberComponent,
    InvoiceVatComponent,
    InvoiceVatListComponent,
    InvoiceVatEditorComponent,
    InvoiceVatPrintComponent,
    InvoiceGstListComponent,
    InvoiceGstComponent,
    InvoiceGstEditorComponent,
    InvoiceGstPrintComponent,
    InvoiceBosComponent,
    InvoiceBosListComponent,
    InvoiceBosEditorComponent,
    InvoiceBosPrintComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    ToastModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [ClientService,
    ClientGetResolve,
    ClientGetAllResolve,
    InvoiceService,
    InvoiceVatService,
    InvoiceVatGetResolve,
    InvoiceGstService,
    InvoiceGstGetResolve,
    InvoiceBosService,
    InvoiceBosGetResolve,
    PopupService,
    {provide: LOCALE_ID, useValue: 'en-IN'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
