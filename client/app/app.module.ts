import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastModule } from 'ng2-toastr';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { JobComponent } from './core/job/job.component';
import { InvoiceComponent } from './core/invoice/invoice.component';
import { DeliveryChallanComponent } from './core/delivery-challan/delivery-challan.component';
import { EstimateComponent } from './core/estimate/estimate.component';
import { BasicLayoutComponent } from './view/basic-layout/basic-layout.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { SideNavComponent } from './view/side-nav/side-nav.component';
import { TopNavComponent } from './view/top-nav/top-nav.component';
import { InvoiceEditorComponent } from './core/invoice/invoice-editor/invoice-editor.component';
import { InvoiceListingComponent } from './core/invoice/invoice-listing/invoice-listing.component';
import { PageNotFoundComponent } from './view/page-not-found/page-not-found.component';
import { ClientComponent } from './core/client/client.component';
import { ClientEditorComponent } from './core/client/client-editor/client-editor.component';
import { ClientListingComponent } from './core/client/client-listing/client-listing.component';
import { ClientDetailsComponent } from './core/client/client-details/client-details.component';
import { ClientService, ClientGetResolve, ClientGetAllResolve } from './core/client/client.service';
import { PopupService } from './shared/popup.service';
import { InvoiceGetResolve, InvoiceService } from './core/invoice/invoice.service';
import { InvoicePreviewComponent } from './core/invoice/invoice-preview/invoice-preview.component';
import { FormattedReadonlyNumberComponent } from './shared/formatted-readonly-number-component';
import { InvoicePreviewTaxComponent } from './core/invoice/invoice-preview-tax/invoice-preview-tax.component';
import { InvoiceVatComponent } from './core/invoice/vat/invoice-vat.component';
import { InvoiceVatListComponent } from './core/invoice/vat/invoice-vat-list/invoice-vat-list.component';
import { InvoiceVatEditorComponent } from './core/invoice/vat/invoice-vat-editor/invoice-vat-editor.component';
import { InvoiceVatPrintComponent } from './core/invoice/vat/invoice-vat-print/invoice-vat-print.component';
import {InvoiceVatGetResolve, InvoiceVatService} from './core/invoice/vat/invoice-vat.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobComponent,
    InvoiceComponent,
    DeliveryChallanComponent,
    EstimateComponent,
    BasicLayoutComponent,
    SideNavComponent,
    TopNavComponent,
    InvoiceEditorComponent,
    InvoiceListingComponent,
    PageNotFoundComponent,
    ClientComponent,
    ClientEditorComponent,
    ClientListingComponent,
    ClientDetailsComponent,
    InvoicePreviewComponent,
    FormattedReadonlyNumberComponent,
    InvoicePreviewTaxComponent,
    InvoiceVatComponent,
    InvoiceVatListComponent,
    InvoiceVatEditorComponent,
    InvoiceVatPrintComponent,
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
    InvoiceGetResolve,
    InvoiceVatService,
    InvoiceVatGetResolve,
    PopupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
